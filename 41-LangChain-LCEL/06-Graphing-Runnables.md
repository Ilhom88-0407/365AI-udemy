# 6-dars. Runnable'larni grafda ko'rish

## 🎬 Boshlashdan oldin

> **"`chain_long.get_graph().print_ascii()`"**

---

## 1. ⚠️ AVVAL — qo'shimcha paket kerak

```python
chain.get_graph().print_ascii()
```

```
ImportError: Install grandalf to draw graphs: `pip install grandalf`.
```

> ## 💥 **KURS BUNI AYTMAYDI.** `grandalf` — **alohida** paket:
> ```bash
> pip install grandalf
> ```

---

## 2. Natija

```python
from langchain_core.runnables import RunnableLambda

z = RunnableLambda(lambda x: sum(x)) | RunnableLambda(lambda x: x ** 2)
z.get_graph().print_ascii()
```

```
+-------------+
| LambdaInput |
+-------------+
       *
       *
       *
  +--------+
  | Lambda |
  +--------+
       *
       *
       *
  +--------+
  | Lambda |
  +--------+
       *
       *
       *
+--------------+
| LambdaOutput |
+--------------+
```

> ## ✅ **ZANJIR TUZILISHI KO'RINIB TURIBDI.**

---

## 3. ⭐ Graf boshqa foydali ma'lumot ham beradi

```python
g = chain.get_graph()
print("tugunlar:", len(g.nodes))
print("qirralar:", len(g.edges))
for n in g.nodes.values():
    print(f"  {n.name}")
```

> ## 💡 **VA MERMAID FORMATIDA HAM CHIQARISH MUMKIN** *(README yoki hujjat uchun)*:
> ```python
> print(chain.get_graph().draw_mermaid())
> ```
> Natijani **Markdown** faylga qo'ysangiz — GitHub uni **rasm** qilib ko'rsatadi.

```python
# PNG rasm (ixtiyoriy, qo'shimcha paketlar kerak)
# chain.get_graph().draw_mermaid_png(output_file_path="zanjir.png")
```

---

## 4. ⚠️ Graf CHEKLOVLARI

```
✅ Ko'rsatadi:  qadamlar KETMA-KETLIGI, parallel shoxlar
❌ Ko'rsatmaydi: har qadam QANCHA VAQT oldi
❌ Ko'rsatmaydi: har qadam NIMA qaytardi
❌ Ko'rsatmaydi: xato QAYERDA yuz berdi
```

> ## 🏆 **NOSOZLIK TUZATISH UCHUN `astream_events` ANCHA KUCHLIROQ** *(3-dars)*:
> ```python
> async for e in chain.astream_events(kirish, version="v2"):
>     print(e["event"], e["name"])
> ```
> U **ish vaqtida** nima bo'layotganini ko'rsatadi, graf esa — faqat **tuzilishni**.

---

## 5. ⭐ Amaliy foyda — hujjat yozish

```python
def zanjir_hujjati(chain, nom):
    """Zanjirni Markdown hujjatga aylantiradi."""
    g = chain.get_graph()
    satrlar = [f"## {nom}\n",
               f"**Qadamlar:** {len(g.nodes)}  ·  **Bog'lanishlar:** {len(g.edges)}\n",
               "```mermaid", g.draw_mermaid(), "```\n",
               "**Kirish sxemasi:**",
               f"`{chain.input_schema.model_json_schema().get('title')}`\n",
               "**Chiqish sxemasi:**",
               f"`{chain.output_schema.model_json_schema().get('title')}`\n"]
    return "\n".join(satrlar)

print(zanjir_hujjati(z, "Yig'indi va kvadrat"))
```

> ## 💡 **BU — JAMOA ISHI UCHUN.** Yangi dasturchi zanjirni **kod o'qimasdan** tushunadi.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** `print_ascii()` uchun nima kerak?

**M2.** Graf nimani ko'rsatadi?

**M3.** Graf nimani ko'rsatmaydi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## `pip install grandalf` — kursda **aytilmagan**.

**M2.** Qadamlar **ketma-ketligi** va **parallel shoxlar**.

**M3.** ## **Vaqt**, **qiymatlar**, **xatolar**. Ular uchun — `astream_events`.

</details>

### 🟡 O'rta

**M4.** ⭐ Turli zanjirlarning grafini chizing.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.runnables import RunnableLambda, RunnableParallel

ketma_ket = RunnableLambda(sum) | RunnableLambda(lambda x: x ** 2)
parallel = RunnableParallel({"a": RunnableLambda(sum),
                             "b": RunnableLambda(max)})
aralash = parallel | RunnableLambda(lambda d: d["a"] + d["b"])

for nom, z in [("ketma-ket", ketma_ket), ("parallel", parallel),
               ("aralash", aralash)]:
    print(f"\n{'='*40}\n{nom}\n{'='*40}")
    z.get_graph().print_ascii()
```

## 💡 **PARALLEL ZANJIR GRAFDA SHOXLANIB KO'RINADI.**

</details>

**M5.** ⭐ Mermaid formatida chiqaring.

<details>
<summary>✅ Yechim</summary>

```python
print(aralash.get_graph().draw_mermaid())
```

Natijani `README.md` ga ```` ```mermaid ```` bloki ichiga qo'ying — GitHub uni **rasm** qilib ko'rsatadi.

</details>

### 🔴 Qiyin

**M6.** ⭐⭐ Zanjir hujjatlovchisi yozing.

<details>
<summary>✅ Yechim</summary>

```python
from pathlib import Path

def zanjirlarni_hujjatla(zanjirlar, fayl="ZANJIRLAR.md"):
    """Loyihaning hamma zanjirini bitta Markdown faylga."""
    q = ["# Loyiha zanjirlari\n"]
    for nom, z in zanjirlar.items():
        g = z.get_graph()
        q += [f"## {nom}\n",
              f"- qadamlar: **{len(g.nodes)}**",
              f"- bog'lanishlar: **{len(g.edges)}**",
              f"- kirish: `{z.input_schema.model_json_schema().get('title')}`",
              f"- chiqish: `{z.output_schema.model_json_schema().get('title')}`\n",
              "```mermaid", g.draw_mermaid(), "```\n"]
    Path(fayl).write_text("\n".join(q), encoding="utf-8")
    print(f"✅ {fayl} yozildi ({len(zanjirlar)} zanjir)")

zanjirlarni_hujjatla({"Ketma-ket": ketma_ket, "Parallel": parallel,
                      "Aralash": aralash})
```

## 🏆 **KOD O'ZGARSA — HUJJAT HAM O'ZGARADI.** Qo'lda yozilgan diagrammalar **eskiradi**, bu — **yo'q**.

</details>

---

## 📌 Xulosa

```bash
pip install grandalf          # ⚠️ kursda aytilmagan
```

```python
chain.get_graph().print_ascii()      # ASCII diagramma
chain.get_graph().draw_mermaid()     # ⭐ Markdown/GitHub uchun
```

| Vosita | Nima ko'rsatadi |
|---|---|
| `get_graph()` | ## **tuzilish** *(statik)* |
| ## `astream_events` | ## **ish vaqti** *(dinamik)* — vaqt, qiymat, xato |

---

⬅️ [5-dars. RunnablePassthrough](05-Piping-Chains-RunnablePassthrough.md) · 🏠 [Modul boshiga](README.md) · ➡️ [7-dars. RunnableParallel](07-RunnableParallel.md)
