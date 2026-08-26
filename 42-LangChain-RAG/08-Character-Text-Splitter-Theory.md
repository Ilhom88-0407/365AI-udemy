# 8-dars. CharacterTextSplitter — nazariya ⭐

## 🎬 Boshlashdan oldin

> **"E'tibor bering — biz BELGILAR haqida gapiryapmiz, tokenlar yoki so'zlar haqida emas."**

---

## 1. `chunk_size` — belgilar soni

```
1500 belgi  →  chunk_size = 500  →  3 ta bo'lak
```

```
[═══ 500 ═══][═══ 500 ═══][═══ 500 ═══]
```

> ## ⚠️⚠️ **BELGILAR ≠ TOKENLAR — VA BU 🇺🇿 O'ZBEKCHA UCHUN MUHIM.**
>
> ```
> 500 belgi (inglizcha)  ≈  125 token
> 500 belgi (o'zbekcha)  ≈  ~200 token      ← 36-modul: 1.88× ustama
> ```
>
> ## 🔑 **Ya'ni bir xil `chunk_size` o'zbekcha matnda ANCHA KO'PROQ token beradi.** Kontekst oynasini hisoblaganda buni **hisobga oling**.

---

## 2. `chunk_overlap` — ustma-ustlik

> **"Bo'laklar ustma-ustligi — ketma-ket bo'laklar orasida takrorlanadigan belgilar soniga to'g'ri keladi."**

```
chunk_overlap = 0                    chunk_overlap = 50
[═ 500 ═][═ 500 ═][═ 500 ═]         [═ 500 ═]
                                        [50|═ 450 ═]
                                              [50|═ 450 ═]
                                                    [50|100]
   3 ta bo'lak                          ⭐ 4 ta bo'lak
```

> **"Ustma-ustlik kiritish bo'linishlar sonini OSHIRADI, lekin uning foydasi — oldingi bo'lakdan keyingisiga KONTEKSTNI olib o'tish."**

> ## 🔑 **NIMA UCHUN BU MUHIM — HAQIQIY MISOL:**
> ```
> ❌ ustma-ustliksiz:
>    Bo'lak 1: "...Muddatli depozit yillik 18% dan 22% gacha"
>    Bo'lak 2: "foiz keltiradi. Minimal summa 1 000 000 so'm."
>              ↑ "foiz" so'zi 2-bo'lakda, "18%" esa 1-da
>              →  savol "depozit foizi qancha?" — IKKALASI HAM to'liq javob EMAS
>
> ✅ ustma-ustlik bilan:
>    Bo'lak 2: "yillik 18% dan 22% gacha foiz keltiradi. Minimal summa..."
>              ↑ ⭐ TO'LIQ javob
> ```

> ## 💰 **NARXI BOR:** `overlap` **bo'laklar sonini** oshiradi → **indekslash** va **saqlash** ko'proq. Lekin bu — **arzon** *(embedding $0.02/1M)*.
>
> ## 🏆 **AMALIY QIYMAT: `chunk_size` ning 10–20% i.** `500` uchun — **50–100**.

---

## 3. ⚠️ `separator` — kursda yetarli tushuntirilmagan

```python
CharacterTextSplitter(separator=".", chunk_size=500, chunk_overlap=50)
```

> ## 🔑 **`separator` — "SHU BELGIDA BO'LISHGA HARAKAT QIL" DEGANI.**
>
> ```
> ① Matnni separator bo'yicha bo'ladi
> ② Bo'laklarni chunk_size ga sig'guncha BIRLASHTIRADI
> ③ Bitta bo'lak chunk_size dan katta bo'lsa — U KATTA QOLADI  ⚠️
> ```

> ## 💥 **③ — MUHIM OGOHLANTIRISH.** Agar matnda **500 belgidan uzun** jumla bo'lsa, `CharacterTextSplitter` uni **bo'la olmaydi** va ogohlantirish beradi:
> ```
> Created a chunk of size 812, which is longer than the specified 500
> ```
>
> ## ✅ **`RecursiveCharacterTextSplitter` BU MUAMMONI HAL QILADI** *(9-dars, 6-bo'lim)* — u **bir necha ajratuvchini** ketma-ket sinaydi.

---

## 4. ⭐ Ajratuvchini tanlash

| `separator` | Qachon |
|---|---|
| `"."` | Jumlalar *(kursdagi)* |
| `"\n\n"` | ## **Paragraflar** — ⭐ ko'pincha **eng yaxshisi** |
| `"\n"` | Qatorlar |
| `" "` | So'zlar *(oxirgi chora)* |
| `""` | Belgilar *(ma'noni buzadi)* |

> ## 🇺🇿 **O'ZBEKCHA UCHUN NOZIKLIK — `"."` XAVFLI:**
> ```
> "1978-yilda tashkil etilgan."     →  "1978" dan keyin nuqta YO'Q ✅
> "Toshkent sh. Amir Temur ko'ch."  →  "sh." va "ko'ch." — QISQARTMALAR!
>                                       →  noto'g'ri joyda bo'linadi 💥
> ```
> ## ✅ **XAVFSIZROQ:** `"\n\n"` *(paragraflar)* yoki `RecursiveCharacterTextSplitter`.

---

## 5. ⚡ Mashqlar

### 🟢 Oson

**M1.** `chunk_size` nimani o'lchaydi?

**M2.** `chunk_overlap` nima uchun?

**M3.** Jumla `chunk_size` dan uzun bo'lsa nima bo'ladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **BELGILAR** — tokenlar yoki so'zlar **emas**.

**M2.** Oldingi bo'lakdan keyingisiga **kontekstni olib o'tish**.

**M3.** ## **U katta qoladi** va ogohlantirish chiqadi. `RecursiveCharacterTextSplitter` buni hal qiladi.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Belgi va token nisbatini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken
enc = tiktoken.get_encoding("o200k_base")

MATNLAR = {
    "inglizcha": "Machine learning is a field of artificial intelligence "
                 "concerned with algorithms that learn from data.",
    "o'zbekcha": "Mashinali o'rganish — sun'iy intellektning ma'lumotdan "
                 "o'rganadigan algoritmlar bilan shug'ullanadigan sohasi.",
}
for nom, m in MATNLAR.items():
    b, t = len(m), len(enc.encode(m))
    print(f"{nom:12s} {b:4d} belgi  {t:3d} token  →  belgi/token = {b/t:.2f}")
    print(f"{'':12s} chunk_size=500 → ~{500/(b/t):.0f} token")
```

## 🔑 **BIR XIL `chunk_size` — TURLI TOKEN SONI.**

</details>

**M5.** ⭐ `overlap` ning bo'laklar soniga ta'sirini hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
def bolaklar_soni(matn_uzunligi, chunk_size, overlap):
    if overlap >= chunk_size:
        raise ValueError("overlap < chunk_size bo'lishi kerak")
    qadam = chunk_size - overlap
    return max(1, -(-(matn_uzunligi - overlap) // qadam))

for ov in [0, 50, 100, 200]:
    n = bolaklar_soni(8000, 500, ov)
    print(f"overlap={ov:3d} → {n:2d} bo'lak  (+{(n/bolaklar_soni(8000,500,0)-1):.0%})")
```

## 💰 **`overlap` bo'laklar sonini oshiradi** — lekin embedding **arzon**.

</details>

**M6.** ⭐ Nuqta ajratuvchisining o'zbekcha muammosini ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
MATN = ("Kompaniya 1978-yilda tashkil etilgan. Manzil: Toshkent sh. "
        "Amir Temur ko'ch. 12-uy. Ish vaqti 9:00 dan 18:00 gacha.")
for i, x in enumerate(MATN.split(".")):
    print(f"  [{i}] {x.strip()!r}")
```

## 💥 **`sh.` va `ko'ch.` NOTO'G'RI JOYDA BO'LDI.**

## ✅ **`RecursiveCharacterTextSplitter` yoki `separator="\n\n"` ishlating.**

</details>

---

## 📌 Xulosa

```
chunk_size    →  ⚠️ BELGILAR (token emas!)   🇺🇿 o'zbekchada ~1.88× ko'proq token
chunk_overlap →  10–20% (500 uchun 50–100)   →  kontekstni olib o'tadi
separator     →  "." (kurs) · "\n\n" (⭐ xavfsizroq) · 🇺🇿 qisqartmalar TUZOG'I

💥 chunk_size dan uzun bo'lak — KATTA QOLADI
✅ RecursiveCharacterTextSplitter buni hal qiladi
```

---

⬅️ [7-dars. Docx2txtLoader](07-Loading-Docx2txtLoader.md) · 🏠 [Modul boshiga](README.md) · ➡️ [9-dars. CharacterTextSplitter — kod](09-Character-Text-Splitter-Code.md)
