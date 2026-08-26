# 🚀 43-modul mini-loyihalari

> **3 ta tayyor loyiha.** ## ⭐ **Hammasi API kalitisiz** — `FakeListChatModel` bilan sinaladi.
>
> Bu modul **nazariy**, shuning uchun loyihalar ham **rejalashtirish va o'lchash** haqida — kod yozishdan **oldin** qilinadigan ish.

## ⚙️ Umumiy tayyorgarlik

```bash
pip install langgraph langchain langchain-core tiktoken pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import os, json, time
from pathlib import Path
from typing import Literal, Annotated
from typing_extensions import TypedDict
from collections.abc import Sequence
import tiktoken, pandas as pd

from langgraph.graph import START, END, StateGraph, add_messages
from langchain_core.messages import (AIMessage, HumanMessage, BaseMessage,
                                     SystemMessage, RemoveMessage)
from langchain_core.language_models.fake_chat_models import FakeListChatModel

ENC = tiktoken.get_encoding("cl100k_base")
```

---

# 🧩 1-loyiha. Graf loyihalovchi

> **Maqsad:** grafni **kod yozishdan oldin** rejalashtirish, tekshirish va **rasm sifatida ko'rish**.

```python
class GrafLoyiha:
    """Graf tuzilishini KOD YOZISHDAN OLDIN tekshiradi va ASCII chizadi."""

    def __init__(self, nom, tavsif=""):
        self.nom, self.tavsif = nom, tavsif
        self.tugunlar = {}        # nom -> vazifa
        self.qirralar = []        # (a, b)
        self.shartli = {}         # manba -> {shart: maqsad}
        self.state = {}           # maydon -> (tip, reducer_kerakmi)

    # ───── qurish ─────
    def tugun(self, nom, vazifa, llm=False):
        self.tugunlar[nom] = {"vazifa": vazifa, "llm": llm}
        return self

    def qirra(self, a, b):
        self.qirralar.append((a, b))
        return self

    def shart(self, manba, yollar):
        self.shartli[manba] = yollar
        return self

    def maydon(self, nom, tip, reducer=False):
        self.state[nom] = {"tip": tip, "reducer": reducer}
        return self

    # ───── tekshirish ─────
    def tekshir(self):
        print(f"📋 {self.nom}")
        if self.tavsif:
            print(f"   {self.tavsif}")
        xato, ogoh = [], []

        nomlar = set(self.tugunlar) | {"START", "END"}

        # ① qirra maqsadlari mavjudmi
        for a, b in self.qirralar:
            for x in (a, b):
                if x not in nomlar:
                    xato.append(f"noma'lum tugun: '{x}'")
        for m, y in self.shartli.items():
            if m not in nomlar:
                xato.append(f"shartli qirra manbai yo'q: '{m}'")
            for shart, maqsad in y.items():
                if maqsad not in nomlar:
                    xato.append(f"'{m}' --{shart}--> noma'lum '{maqsad}'")

        # ② yetib bo'lmaydigan tugun
        kiruvchi = {b for _, b in self.qirralar}
        kiruvchi |= {t for y in self.shartli.values() for t in y.values()}
        for t in self.tugunlar:
            if t not in kiruvchi:
                xato.append(f"💥 '{t}' tuguniga HECH KIM kirmaydi")

        # ③ boshi berk tugun
        chiquvchi = {a for a, _ in self.qirralar} | set(self.shartli)
        for t in self.tugunlar:
            if t not in chiquvchi:
                xato.append(f"💥 '{t}' tugunidan CHIQISH yo'q")

        # ④ END ga yo'l bormi
        end_bor = any(b == "END" for _, b in self.qirralar) or any(
            "END" in y.values() for y in self.shartli.values())
        if not end_bor:
            xato.append("💥 END ga yo'l YO'Q — graf TO'XTAMAYDI")

        # ⑤ START dan chiqish
        if not any(a == "START" for a, _ in self.qirralar):
            xato.append("💥 START dan chiquvchi qirra yo'q")

        # ⑥ sikl
        sikllar = [(m, s, t) for m, y in self.shartli.items()
                   for s, t in y.items() if t in self.tugunlar]
        if sikllar:
            ogoh.append("⭐ SIKL bor — recursion_limit ni QO'LDA qo'ying "
                        "(standart 10 000+, o'lchandi)")

        # ⑦ state
        if not self.state:
            xato.append("💥 state BO'SH")
        for nom, m in self.state.items():
            if nom == "messages" and not m["reducer"]:
                xato.append("💥 'messages' da REDUCER yo'q — "
                            "xabarlar ALMASHTIRILADI, YO'QOLADI")

        # ⑧ narx
        llm_tugun = [t for t, m in self.tugunlar.items() if m["llm"]]
        if len(llm_tugun) > 1:
            ogoh.append(f"💰 {len(llm_tugun)} ta LLM tuguni: {llm_tugun} — "
                        f"har burilishda {len(llm_tugun)}× chaqiruv")

        print(f"\n   tugunlar : {len(self.tugunlar)} "
              f"({len(llm_tugun)} tasi LLM ishlatadi)")
        print(f"   qirralar : {len(self.qirralar)} + "
              f"{len(self.shartli)} shartli")
        print(f"   state    : {list(self.state)}")

        if sikllar:
            print("   sikllar  :")
            for m, s, t in sikllar:
                print(f"       {m} --{s}--> {t}  ⭐")

        if ogoh:
            print()
            for o in ogoh:
                print(f"   {o}")
        if xato:
            print(f"\n   ❌ {len(xato)} MUAMMO:")
            for x in xato:
                print(f"       {x}")
            return False
        print("\n   ✅ tuzilish to'g'ri")
        return True

    # ───── chizish ─────
    def chiz(self):
        print(f"\n{self.nom}")
        print("=" * (len(self.nom)))
        keyingi = {}
        for a, b in self.qirralar:
            keyingi.setdefault(a, []).append((b, None))
        for m, y in self.shartli.items():
            for s, t in y.items():
                keyingi.setdefault(m, []).append((t, s))

        korilgan, navbat = set(), ["START"]
        while navbat:
            t = navbat.pop(0)
            if t in korilgan:
                continue
            korilgan.add(t)
            vazifa = self.tugunlar.get(t, {}).get("vazifa", "")
            llm = " 🤖" if self.tugunlar.get(t, {}).get("llm") else ""
            print(f"\n[{t}]{llm}" + (f"  — {vazifa}" if vazifa else ""))
            for maqsad, shart in keyingi.get(t, []):
                belgi = f" --{shart}-->" if shart else " ------->"
                sikl = "  ⭐ SIKL" if maqsad in korilgan else ""
                print(f"     {belgi} {maqsad}{sikl}")
                navbat.append(maqsad)

    # ───── kod skeleti ─────
    def kod(self):
        q = ["from typing import Literal, Annotated",
             "from typing_extensions import TypedDict",
             "from collections.abc import Sequence",
             "from langgraph.graph import START, END, StateGraph, add_messages",
             "from langchain_core.messages import BaseMessage", "", "",
             "class State(TypedDict):"]
        for nom, m in self.state.items():
            if m["reducer"]:
                q.append(f"    {nom}: Annotated[{m['tip']}, add_messages]")
            else:
                q.append(f"    {nom}: {m['tip']}")
        q.append("")
        for t, m in self.tugunlar.items():
            q.append("")
            q.append(f"def {t}(state: State) -> State:")
            q.append(f'    """{m["vazifa"]}"""')
            q.append(f'    print("-------> {t}")')
            q.append("    return State()          # TODO")
        q += ["", "", "graph = StateGraph(State)"]
        for t in self.tugunlar:
            q.append(f'graph.add_node("{t}", {t})')
        q.append("")
        for a, b in self.qirralar:
            aa = "START" if a == "START" else f'"{a}"'
            bb = "END" if b == "END" else f'"{b}"'
            q.append(f"graph.add_edge({aa}, {bb})")
        for m, y in self.shartli.items():
            q.append("")
            qiymatlar = ", ".join(
                f'"{"__end__" if t == "END" else t}"' for t in y.values())
            q.append(f"def {m}_routing(state: State) -> Literal[{qiymatlar}]:")
            for s, t in y.items():
                hedef = "__end__" if t == "END" else t
                q.append(f'    # {s} → {hedef}')
            q.append("    ...                     # TODO")
            q.append(f'graph.add_conditional_edges("{m}", {m}_routing)')
        q += ["", "graph_compiled = graph.compile()",
              "print(graph_compiled.get_graph().draw_ascii())"]
        kod = "\n".join(q)
        print(kod)
        return kod


# ─── ishlatish ───
loyiha = (GrafLoyiha("Bank kredit yordamchisi",
                     "Foydalanuvchidan ma'lumot yig'ib, oylik to'lovni hisoblaydi")
          .maydon("messages", "Sequence[BaseMessage]", reducer=True)
          .maydon("summa", "int")
          .maydon("muddat", "int")
          .maydon("oylik_tolov", "float")
          .tugun("salomlash", "foydalanuvchini kutib oladi")
          .tugun("summa_sorash", "kredit summasini so'raydi")
          .tugun("muddat_sorash", "muddatni so'raydi")
          .tugun("hisoblash", "oylik to'lovni hisoblaydi (LLM emas!)")
          .tugun("tushuntirish", "natijani tabiiy tilda tushuntiradi", llm=True)
          .tugun("tasdiqlash", "ha/yo'q so'raydi")
          .qirra("START", "salomlash")
          .qirra("salomlash", "summa_sorash")
          .qirra("summa_sorash", "muddat_sorash")
          .qirra("muddat_sorash", "hisoblash")
          .qirra("hisoblash", "tushuntirish")
          .qirra("tushuntirish", "tasdiqlash")
          .shart("tasdiqlash", {"ha": "END", "yo'q": "summa_sorash"}))

loyiha.tekshir()
loyiha.chiz()
print("\n" + "─" * 60 + "\n")
loyiha.kod()
```

> ## 🏆 **`kod()` — TAYYOR SKELET CHIQARADI.** Siz faqat tugun tanalarini **to'ldirasiz**.
>
> ## 💥 **`tekshir()` DAGI ENG MUHIM UCH TEKSHIRUV:**
> ```
> ① "tuguniga HECH KIM kirmaydi"   →  eng ko'p uchraydigan xato
> ② "tugunidan CHIQISH yo'q"       →  graf ishga tushmaydi
> ③ "'messages' da REDUCER yo'q"   →  💥 xabarlar JIM YO'QOLADI
> ```

---

# 💰 2-loyiha. Suhbat narxi kalkulyatori

> **Maqsad:** arxitektura qarorini **taxmin bilan emas, raqam bilan** qabul qilish.

```python
NARXLAR = {                        # $ / 1M token  (kirish, chiqish)
    "gpt-4o-mini":  (0.15,  0.60),
    "gpt-4.1-mini": (0.40,  1.60),
    "gpt-4o":       (2.50, 10.00),
    "ollama (mahalliy)": (0.0, 0.0),
}

TIL_KOEF = {"en": 1.00, "uz": 1.88, "ru": 1.75}     # 36-modulda o'lchangan


class NarxKalkulyator:
    """Xotira strategiyasining narxini BASHORAT qiladi."""

    def __init__(self, savol_token=40, javob_token=80, til="uz"):
        self.s = savol_token * TIL_KOEF[til]
        self.j = javob_token * TIL_KOEF[til]
        self.til = til
        self.koef = TIL_KOEF[til]

    def _simulyatsiya(self, burilish, strategiya, trim_n=5, xulosa_token=60):
        kirish, chiqish, chaqiruv = 0.0, 0.0, 0
        tarix = 0.0
        for _ in range(burilish):
            tarix += self.s + self.j
            if strategiya == "trim":
                tarix = min(tarix, (self.s + self.j) * trim_n / 2)
            elif strategiya == "xulosalash":
                tarix = xulosa_token * self.koef
            kirish += tarix
            chiqish += self.j
            chaqiruv += 2 if strategiya == "xulosalash" else 1
            if strategiya == "xulosalash":
                kirish += tarix            # xulosalash ham kirish yeydi
                chiqish += xulosa_token * self.koef
        return kirish, chiqish, chaqiruv

    def taqqosla(self, burilish=20, kunlik_suhbat=1000, trim_n=5):
        q = []
        for strat in ["qo'shish", "trim", "xulosalash"]:
            k, c, ch = self._simulyatsiya(burilish, strat, trim_n)
            for model, (nk, nc) in NARXLAR.items():
                bir = k / 1e6 * nk + c / 1e6 * nc
                q.append({"strategiya": strat, "model": model,
                          "chaqiruv": ch, "kirish_tok": int(k),
                          "1_suhbat_$": round(bir, 5),
                          "kunlik_$": round(bir * kunlik_suhbat, 2),
                          "yillik_$": round(bir * kunlik_suhbat * 365)})
        d = pd.DataFrame(q)
        print(f"🌐 til={self.til} (koef {self.koef}) · {burilish} burilish · "
              f"kuniga {kunlik_suhbat} suhbat\n")
        print(d.to_string(index=False))

        # tavsiya
        pulli = d[d.model != "ollama (mahalliy)"]
        eng = pulli.loc[pulli["yillik_$"].idxmin()]
        print(f"\n🏆 ENG ARZON (pulli): {eng['strategiya']} + {eng['model']} "
              f"→ ${eng['yillik_$']}/yil")

        qoshish = d[(d.strategiya == "qo'shish") & (d.model == "gpt-4o-mini")]
        trim = d[(d.strategiya == "trim") & (d.model == "gpt-4o-mini")]
        if len(qoshish) and len(trim):
            f = qoshish["yillik_$"].iloc[0] / max(1, trim["yillik_$"].iloc[0])
            print(f"💡 trim, qo'shishdan {f:.1f}× arzon")

        print("\n⚠️ ESLATMA: xulosalash CHAQIRUVNI ikkilantiradi — "
              "kechikish ham 2× oshadi")
        return d

    def tenglik_nuqtasi(self, kunlik_suhbat=1000, burilish=20,
                        server_narxi_oylik=200):
        """Mahalliy model (Ollama) qachon ARZONROQ bo'ladi?"""
        k, c, _ = self._simulyatsiya(burilish, "trim")
        for model, (nk, nc) in NARXLAR.items():
            if nk == 0:
                continue
            bir = k / 1e6 * nk + c / 1e6 * nc
            oylik = bir * kunlik_suhbat * 30
            holat = ("🏆 MAHALLIY arzonroq" if oylik > server_narxi_oylik
                     else "☁️ API arzonroq")
            print(f"  {model:20s} ${oylik:8.2f}/oy  vs  "
                  f"${server_narxi_oylik}/oy server  → {holat}")


k = NarxKalkulyator(savol_token=40, javob_token=80, til="uz")
k.taqqosla(burilish=20, kunlik_suhbat=1000)
print("\n─── mahalliy model tenglik nuqtasi ───")
k.tenglik_nuqtasi()
```

> ## 🇺🇿 **NIMA UCHUN BU LOYIHA MUHIM?**
> ```
> O'zbekcha token 1.88× qimmat  →  narx ham 1.88×
> → strategiya tanlovi 🇺🇿 loyihalarda IKKI BAROBAR muhimroq
> → mahalliy model (Ollama) tenglik nuqtasi ANCHA TEZROQ keladi
> ```
>
> ## ⚠️ **BASHORAT — TAXMINIY.** Haqiqiy raqamni **o'z jurnalingizdan** oling *(47-modul)*.

---

# 📊 3-loyiha. Xotira strategiyasi sinovchisi

> **Maqsad:** uch strategiyani **haqiqiy grafda** ishga tushirib, **sifat va narxni** birga o'lchash.

```python
class StrategiyaSinov:
    """Uch xotira strategiyasini bir xil suhbatda taqqoslaydi."""

    def __init__(self, chat_yaratuvchi, savollar):
        """chat_yaratuvchi() — HAR sinovda YANGI model qaytarsin (adolatli)."""
        self.chat_yaratuvchi = chat_yaratuvchi
        self.savollar = savollar
        self.natijalar = []

    @staticmethod
    def _tok(xabarlar):
        return sum(len(ENC.encode(str(m.content))) for m in xabarlar)

    def _graf(self, strategiya, chat, hisob, trim_n=5):
        class S(TypedDict):
            messages: Annotated[Sequence[BaseMessage], add_messages]
            summary: str

        savol_iter = iter(self.savollar)

        def ask(state: S) -> S:
            q = next(savol_iter, "yakuniy savol")
            return S(messages=[AIMessage("Savolingiz?"), HumanMessage(q)])

        def bot(state: S) -> S:
            kirish = ([SystemMessage(f"Xulosa: {state.get('summary','')}")]
                      if state.get("summary") else []) + list(state["messages"])
            hisob["chaqiruv"] += 1
            hisob["kirish_token"] += self._tok(kirish)
            return S(messages=[chat.invoke(kirish)])

        def trim(state: S) -> S:
            return S(messages=[RemoveMessage(id=i.id)
                               for i in state["messages"][:-trim_n]])

        def xulosala(state: S) -> S:
            matn = "".join(f"{i.type}: {i.content}\n" for i in state["messages"])
            kirish = [HumanMessage(f"Oldingi xulosa: {state.get('summary','')}\n"
                                   f"Yangi suhbat:\n{matn}")]
            hisob["chaqiruv"] += 1
            hisob["kirish_token"] += self._tok(kirish)
            s = chat.invoke(kirish)
            return S(messages=[RemoveMessage(id=i.id)
                               for i in state["messages"]],
                     summary=s.content)

        g = StateGraph(S)
        g.add_node("ask", ask); g.add_node("bot", bot)
        g.add_edge(START, "ask"); g.add_edge("ask", "bot")
        if strategiya == "trim":
            g.add_node("trim", trim)
            g.add_edge("bot", "trim"); g.add_edge("trim", END)
        elif strategiya == "xulosalash":
            g.add_node("xulosala", xulosala)
            g.add_edge("bot", "xulosala"); g.add_edge("xulosala", END)
        else:
            g.add_edge("bot", END)

        from langgraph.checkpoint.memory import InMemorySaver
        return g.compile(checkpointer=InMemorySaver()), S

    def ishga_tushir(self, burilish=10):
        for strat in ["qo'shish", "trim", "xulosalash"]:
            hisob = {"chaqiruv": 0, "kirish_token": 0}
            chat = self.chat_yaratuvchi()
            gc, S = self._graf(strat, chat, hisob)
            cfg = {"configurable": {"thread_id": strat}}
            t0 = time.perf_counter()
            oxirgi = None
            for b in range(burilish):
                oxirgi = gc.invoke(S(messages=[]), cfg)
            self.natijalar.append({
                "strategiya": strat,
                "burilish": burilish,
                "LLM_chaqiruv": hisob["chaqiruv"],
                "kirish_token": hisob["kirish_token"],
                "yakuniy_xabar": len(oxirgi["messages"]),
                "xulosa_bor": bool(oxirgi.get("summary")),
                "s": round(time.perf_counter() - t0, 2)})
        return self.hisobot()

    def hisobot(self):
        d = pd.DataFrame(self.natijalar)
        d["narx_$_1000_suhbat"] = (d.kirish_token / 1e6 * 0.15 * 1000).round(3)
        print(d.to_string(index=False))

        eng_arzon = d.loc[d.kirish_token.idxmin()]
        eng_qimmat = d.loc[d.kirish_token.idxmax()]
        print(f"\n🏆 eng arzon : {eng_arzon.strategiya} "
              f"({eng_arzon.kirish_token} token)")
        print(f"💰 eng qimmat: {eng_qimmat.strategiya} "
              f"({eng_qimmat.kirish_token} token) — "
              f"{eng_qimmat.kirish_token/max(1,eng_arzon.kirish_token):.1f}×")

        x = d[d.strategiya == "xulosalash"]
        q = d[d.strategiya == "qo'shish"]
        if len(x) and len(q):
            print(f"\n⚠️ xulosalash {x.LLM_chaqiruv.iloc[0]} chaqiruv qildi, "
                  f"qo'shish esa {q.LLM_chaqiruv.iloc[0]} — "
                  f"{x.LLM_chaqiruv.iloc[0]/q.LLM_chaqiruv.iloc[0]:.0f}×")
            print("   → token tejaldi, LEKIN kechikish va chaqiruv OSHDI")

        print("\n💡 QAROR QOIDASI:")
        print("   suhbat < 10 burilish   →  qo'shish YETADI (soddaroq)")
        print("   suhbat 10–50 burilish  →  ⭐ trim")
        print("   suhbat > 50 burilish   →  ⭐ xulosalash (yoki trim + xulosa)")
        return d


JAVOB = ("Iste'mol krediti yillik 24% dan boshlanadi, muddati 24 oygacha. "
         "Daromad spravkasi va pasport nusxasi talab qilinadi.")
SAVOLLAR = ["Kredit foizi qancha?", "Qanday hujjat kerak?",
            "Muddat qancha?", "Erta to'lasam bo'ladimi?",
            "Kafil kerakmi?", "Onlayn ariza bormi?",
            "Qancha kunda javob beriladi?", "Yoshim 22, bo'ladimi?",
            "Ish staji qancha bo'lishi kerak?", "Sug'urta shartmi?"]

sinov = StrategiyaSinov(
    chat_yaratuvchi=lambda: FakeListChatModel(responses=[JAVOB] * 80),
    savollar=SAVOLLAR)
sinov.ishga_tushir(burilish=10)
```

> ## 🏆 **BU LOYIHA — 46 VA 47-MODULLARNING OLDINDAN AMALIYOTI.**
>
> ## 🔬 **NIMA O'LCHANADI:**
> ```
> LLM_chaqiruv   →  kechikish va chaqiruv narxi
> kirish_token   →  ⭐ ASOSIY narx omili
> yakuniy_xabar  →  state qanchalik o'sgan
> ```
>
> ## 💡 **`chat_yaratuvchi` FUNKSIYA BO'LISHI SHART** — har sinovda **yangi model**, aks holda `FakeListChatModel` javoblari **oldingi sinovdan davom etadi** va taqqoslash **adolatsiz** bo'ladi.

---

## 📌 Loyihalar xaritasi

| # | Loyiha | Nima hal qiladi | Kalit |
|---:|---|---|---|
| 1 | 🧩 **Graf loyihalovchi** | Xatolarni **kod yozishdan oldin** topish | ## `tekshir()` + `kod()` |
| 2 | 💰 **Narx kalkulyatori** | Arxitektura qarorini **raqam bilan** | ## 🇺🇿 **1.88× koef** |
| 3 | 📊 **Strategiya sinovchisi** | Uch usulni **haqiqiy grafda** | ## token ↔ chaqiruv savdosi |

---

⬅️ [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
