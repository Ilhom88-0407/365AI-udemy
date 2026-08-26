# 3-dars. Python bilan ulanish ⭐

## 🎬 Boshlashdan oldin

> **"`.env` faylini yaratishingiz kerak — u API kaliti va muhitni saqlaydi."**

---

## 1. Kursning kodi

```python
import pinecone
from pinecone import Pinecone, ServerlessSpec
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(), override=True)

pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"),
              environment=os.environ.get("PINECONE_ENV"))
pc.list_indexes()
```

```
{'indexes': [{'dimension': 3,
              'host': 'my-index-bbthoyp.svc.aped-4627-b74a.pinecone.io',
              'metric': 'cosine',
              'name': 'my-index',
              'spec': {'serverless': {'cloud': 'aws', 'region': 'us-east-1'}},
              'status': {'ready': True, 'state': 'Ready'}}]}
```

> ## ⚠️ **BIR NECHA ESKIRGAN DETAL:**
> ```
> ① import pinecone           →  ORTIQCHA (from pinecone import ... yetadi)
> ② environment=...           →  ⚠️ ESKI SDK qoldig'i, Serverless'da KERAK EMAS
> ③ os.environ.get(...)       →  💡 kalit yo'q bo'lsa None → tushunarsiz xato
> ```
>
> ## ✅ **ZAMONAVIY VARIANT:**
> ```python
> from pinecone import Pinecone, ServerlessSpec
> from dotenv import load_dotenv
> import os
>
> load_dotenv(override=True)
> kalit = os.environ["PINECONE_API_KEY"]      # ⭐ yo'q bo'lsa ANIQ KeyError
> pc = Pinecone(api_key=kalit)
> ```

---

## 2. ⭐ `find_dotenv()` nima qiladi?

```python
from dotenv import load_dotenv, find_dotenv

print("topildi:", find_dotenv())
load_dotenv(find_dotenv(), override=True)
```

> ## 🔑 **`find_dotenv()` — `.env` FAYLINI YUQORIGA QARAB IZLAYDI:**
> ```
> ./                      ← avval shu yerda
> ../                     ← keyin yuqorida
> ../../                  ← va hokazo
> ```
>
> ## 💡 **QULAY:** notebook `notebooks/` papkasida bo'lsa ham, `.env` **loyiha ildizida** bo'lishi mumkin.
>
> ## ⚠️ **LEKIN CHALKASHTIRADI HAM:** noto'g'ri `.env` topilsa — **jim ravishda eski kalit** yuklanadi.
>
> ## ✅ **ANIQROQ:**
> ```python
> from pathlib import Path
> yol = Path(__file__).parent / ".env"          # yoki aniq yo'l
> load_dotenv(yol, override=True)
> print("yuklandi:", yol.exists())
> ```

---

## 3. ⭐⭐ `override=True` — 37-modulda ko'rganimiz

```python
load_dotenv(override=False)     # standart — tizim o'zgaruvchisi USTUN
load_dotenv(override=True)      # ⭐ .env fayl USTUN
```

> ## 💥 **BU — SOATLAB NOSOZLIK TUZATISHNING SABABI:**
> ```
> Tizimda eski PINECONE_API_KEY bor
> .env da yangi kalit yozilgan
> override=False  →  💥 ESKI kalit ishlatiladi, siz esa yangisini kutasiz
> ```

---

## 4. ⭐ Ulanishni tekshirish

```python
def ulanishni_tekshir():
    """Kalitni CHIQARMASDAN ulanishni tekshiradi."""
    import os
    from dotenv import load_dotenv
    load_dotenv(override=True)

    kalit = os.getenv("PINECONE_API_KEY")
    if not kalit:
        print("⚪ PINECONE_API_KEY yo'q → mahalliy Chroma ishlatiladi")
        return None
    print(f"✅ kalit: {kalit[:8]}...{kalit[-4:]} ({len(kalit)} belgi)")

    try:
        from pinecone import Pinecone
        pc = Pinecone(api_key=kalit)
        indekslar = pc.list_indexes()
        print(f"✅ ulanish OK · {len(indekslar)} indeks")
        for i in indekslar:
            print(f"   {i.name:20s} o'lcham {i.dimension} · "
                  f"metrika {i.metric} · {i.status['state']}")
        return pc
    except Exception as e:
        print(f"💥 {type(e).__name__}: {str(e)[:80]}")
        return None


pc = ulanishni_tekshir()
```

> ## 🏆 **UCHTA TEKSHIRUV — VA KALIT HECH QAYERDA TO'LIQ CHIQMAYDI.**

---

## 5. ⭐⭐ Mahalliy variant — bir xil interfeys

```python
import chromadb


def mahalliy_ulanish(yol="./vdb"):
    client = chromadb.PersistentClient(path=yol)
    kolleksiyalar = client.list_collections()
    print(f"⭐ Chroma (mahalliy): {yol}")
    print(f"   {len(kolleksiyalar)} kolleksiya")
    for c in kolleksiyalar:
        coll = client.get_collection(c.name)
        print(f"   {c.name:20s} {coll.count():6d} vektor · "
              f"metrika {c.metadata.get('hnsw:space', 'l2') if c.metadata else 'l2'}")
    return client


client = mahalliy_ulanish()
```

```
⭐ Chroma (mahalliy): ./vdb
   1 kolleksiya
   my-index                  0 vektor · metrika cosine
```

> ## 🔑 **AYNI MA'LUMOT — API kaliti va internet KERAK EMAS.**

---

## 6. ⚠️ Tez-tez uchraydigan xatolar

```python
# 💥 ① Kalit yo'q
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))   # → None
# xato: "Failed to parse API key" yoki tushunarsiz 401
# ✅ os.environ["PINECONE_API_KEY"]  →  aniq KeyError

# 💥 ② .env yuklanmagan
# xato: kalit None
# ✅ print("yuklandi:", load_dotenv(override=True))

# 💥 ③ Eski SDK sintaksisi
pinecone.init(api_key=..., environment=...)     # ❌ 2.x versiyada edi
# ✅ pc = Pinecone(api_key=...)                  # 3.x+

# 💥 ④ Indeks hali tayyor emas
index = pc.Index("yangi-indeks")                # yaratilgandan darhol keyin
# ✅ status "Ready" bo'lishini KUTING
```

```python
# ⭐ Indeks tayyor bo'lishini kutish
import time

def kutish(pc, nom, maks_soniya=60):
    t0 = time.time()
    while time.time() - t0 < maks_soniya:
        holat = pc.describe_index(nom).status
        if holat["ready"]:
            print(f"✅ '{nom}' tayyor ({time.time()-t0:.1f}s)")
            return True
        time.sleep(2)
    print(f"⚠️ '{nom}' {maks_soniya}s ichida tayyor bo'lmadi")
    return False
```

> ## 💥 **④ — KURSDA AYTILMAGAN, LEKIN JUDA TEZ-TEZ UCHRAYDI.** Serverless indeks **bir necha soniya** tayyorlanadi.

---

## 7. 🇺🇿 `.env` fayli va jamoa ishi

```bash
# .env  (⚠️ HECH QACHON gitga yuklamang)
PINECONE_API_KEY=pcsk_xxxxx
OPENAI_API_KEY=sk-xxxxx
```

```bash
# .env.example  (✅ gitga yuklanadi — namuna sifatida)
PINECONE_API_KEY=
OPENAI_API_KEY=
```

```bash
# .gitignore
.env
*.db
vdb/
__pycache__/
```

> ## 🏆 **`.env.example` — JAMOADA ISHLASHNING STANDART NAQSHI.** Yangi ishtirokchi **qaysi kalitlar kerakligini** ko'radi, lekin **kalitlarni olmaydi**.
>
> ## ⚠️ **VA AGAR `.env` XATO BILAN GITGA TUSHIB QOLSA:**
> ```
> ① Kalitni DARHOL o'chiring (Pinecone/OpenAI panelida)
> ② Yangi kalit yarating
> ③ git tarixidan tozalash YETARLI EMAS — kalit allaqachon ko'rilgan
> ```

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** `find_dotenv()` nima qiladi?

**M2.** `override=True` nima uchun?

**M3.** `.env.example` nima uchun kerak?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## `.env` faylini **yuqoriga qarab** izlaydi.

**M2.** ## `.env` fayl **tizim o'zgaruvchisidan ustun** bo'lsin.

**M3.** ## Jamoaga **qaysi kalitlar kerakligini** ko'rsatadi *(kalitlarsiz)*.

</details>

### 🟡 O'rta

**M4.** ⭐ Ulanishni xavfsiz tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
import os
from dotenv import load_dotenv

yuklandi = load_dotenv(override=True)
print("`.env` yuklandi:", yuklandi)

KALITLAR = ["PINECONE_API_KEY", "OPENAI_API_KEY", "PINECONE_ENV"]
for k in KALITLAR:
    v = os.getenv(k)
    if v:
        print(f"  ✅ {k:22s} {v[:6]}...{v[-4:]} ({len(v)} belgi)")
    else:
        print(f"  ⚪ {k:22s} yo'q")

if not os.getenv("PINECONE_API_KEY"):
    print("\n⭐ mahalliy Chroma ishlatiladi — hech qanday kalit KERAK EMAS")
```

## 🔑 **KALIT HECH QAYERDA TO'LIQ CHIQMAYDI** — faqat boshi va oxiri.

</details>

**M5.** ⭐ Mahalliy ulanishni tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
import chromadb

client = chromadb.PersistentClient(path="./vdb")
kolleksiyalar = client.list_collections()
print(f"⭐ {len(kolleksiyalar)} kolleksiya")
for c in kolleksiyalar:
    coll = client.get_collection(c.name)
    metrika = (c.metadata or {}).get("hnsw:space", "l2")
    print(f"  {c.name:20s} {coll.count():6d} vektor · {metrika}")
    if metrika == "l2":
        print("     ⚠️ l2 — ballar MASOFA (12–15), o'xshashlik EMAS")
```

</details>

**M6.** ⭐⭐ Universal ulanish funksiyasi.

<details>
<summary>✅ Yechim</summary>

```python
import os, time


def ulanish(nom="my-index", olcham=384, metrika="cosine", yol="./vdb"):
    """☁️ Pinecone yoki ⭐ Chroma — avtomatik tanlaydi va TEKSHIRADI."""
    from dotenv import load_dotenv
    load_dotenv(override=True)

    kalit = os.getenv("PINECONE_API_KEY")
    if kalit:
        try:
            from pinecone import Pinecone, ServerlessSpec
            pc = Pinecone(api_key=kalit)
            mavjud = {i.name: i for i in pc.list_indexes()}

            if nom in mavjud:
                i = mavjud[nom]
                if i.dimension != olcham:
                    print(f"💥 '{nom}' o'lchami {i.dimension}, "
                          f"kerak {olcham} — indeksni QAYTA yarating")
                    return None, None
                if i.metric != metrika:
                    print(f"⚠️ '{nom}' metrikasi {i.metric}, "
                          f"kutilgan {metrika}")
            else:
                pc.create_index(name=nom, dimension=olcham, metric=metrika,
                                spec=ServerlessSpec(cloud="aws",
                                                    region="us-east-1"))
                t0 = time.time()
                while not pc.describe_index(nom).status["ready"]:
                    if time.time() - t0 > 60:
                        print("⚠️ indeks 60s ichida tayyor bo'lmadi")
                        break
                    time.sleep(2)
                print(f"✅ '{nom}' yaratildi ({time.time()-t0:.1f}s)")
            print(f"☁️ Pinecone: {nom} ({olcham}, {metrika})")
            return pc.Index(nom), "pinecone"
        except Exception as e:
            print(f"💥 Pinecone: {type(e).__name__}: {str(e)[:60]}")
            print("   → mahalliy Chroma'ga o'tildi")

    import chromadb
    client = chromadb.PersistentClient(path=yol)
    coll = client.get_or_create_collection(nom,
                                           metadata={"hnsw:space": metrika})
    print(f"⭐ Chroma (mahalliy): {nom} ({metrika}) · {coll.count()} vektor")
    return coll, "chroma"


index, tur = ulanish("kurslar", olcham=384)
```

## 🏆 **UCH HIMOYA:**
```
① o'lcham MOS KELMASA — ogohlantiradi (jim ishlamaydi)
② metrika boshqacha bo'lsa — ogohlantiradi
③ Pinecone ishlamasa — MAHALLIY bazaga o'tadi (dars to'xtamaydi)
```

</details>

---

## 📌 Xulosa

```python
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
import os

load_dotenv(override=True)                       # ⭐ override SHART
pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])   # ⭐ [] — aniq xato
```

```
⚠️ Kursdagi eskirgan detallar:
   import pinecone       →  ortiqcha
   environment=...       →  Serverless'da KERAK EMAS
   os.environ.get(...)   →  None → tushunarsiz xato

💥 Serverless indeks bir necha soniya TAYYORLANADI — status["ready"] ni kuting
🔒 .env → .gitignore · .env.example → gitga
⭐ Mahalliy Chroma — hech qanday kalit va internet KERAK EMAS
```

---

⬅️ [2-dars. Ro'yxatdan o'tish](02-Pinecone-Registration-and-Index.md) · 🏠 [Modul boshiga](README.md) · ➡️ [4-dars. Indeks yaratish va o'chirish](04-Creating-and-Deleting-Index.md)
