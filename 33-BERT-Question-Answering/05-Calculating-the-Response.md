# 5-dars. Javobni hisoblash

## 🎬 Boshlashdan oldin

> ## **"BERT savolimizga javob matnimizning QAYERIDA ekanini START VEKTORLARI va END VEKTORLARI yaratish orqali hisoblaydi."**
>
> **"Keyin u bu start va end vektorlarini oladi va ular bilan har bir tokenning YAKUNIY EMBEDDINGI orasidagi SKALYAR KO'PAYTMANI oladi."**
>
> ## **"Bu natija keyin SOFTMAX funksiyasidan o'tadi va ehtimollik balli beradi. Eng yuqori ehtimollikka ega so'z to'g'ri START yoki END tokeni deb hisoblanadi."**

---

## 1. G'oya — javob "kesma" sifatida

![Javobni topish](assets/03-start-end.svg)

```
KONTEKST (tokenlarga bo'lingan):

  ... the first dvd player and disc were released in the
      united states on  march  24  ,  1997  .
                          ↑              ↑
                        START          END

  JAVOB = START dan END gacha bo'lgan TOKENLAR
```

> ## 🔑 **BERT javobni YARATMAYDI — u ikkita RAQAM topadi.**
> ```
> start_index  →  javob QAYSI tokendan boshlanadi
> end_index    →  javob QAYSI tokenda tugaydi
> ```
> **Qolganini oddiy Python qiladi:** `tokenlar[start : end+1]`.

---

## 2. Start va end pozitsiyalarini olamiz

> **"Chiqishimizdan start va end token pozitsiyalarini olishni xohlaymiz. `torch.argmax` dan foydalanamiz va chiqishdan `start_logits` ni olamiz. Xuddi shunday `end_logits` uchun ham."**

```python
start_index = int(torch.argmax(chiqish.start_logits))
end_index = int(torch.argmax(chiqish.end_logits))

print("start index:", start_index)
print("end index  :", end_index)
```

```
start index: 43
end index  : 46
```

> ## 💡 **`argmax` — 30-modul, 9-darsdan tanish.** U **eng yuqori ball**ga ega indeksni qaytaradi.

---

## 3. Javobni yig'amiz

> **"Keling, buni to'g'ri tokenlarni olish va javobimizni olish uchun ishlatamiz. Javobimizni yaratamiz va start indeks bilan end indeks PLYUS BIR orasidagi tokenlarni birlashtiramiz."**

```python
javob = " ".join(tokenlar[start_index : end_index + 1])
print("JAVOB:", repr(javob))
```

```
JAVOB: 'november 1 , 1996'
```

> ## ⚠️ **`+ 1` ga e'tibor bering.** Python kesmasi **oxirgi elementni qo'shmaydi**, shuning uchun `end_index + 1` **shart**. Usiz javobning **oxirgi tokeni yo'qoladi**.

---

## 4. 🎯 Natija — VA KURSDAN FARQ

> **"Javobimiz — March 24th, 1997."**

### ❗ Bizning natijamiz BOSHQACHA

```
KURSDA aytilgan  :  "March 24th, 1997"
BIZDA chiqdi     :  "november 1 , 1996"
```

**Ikkala modelda ham sinab ko'rdik:**

```
bert-large-uncased-...-squad  (334M)  →  'november 1 , 1996'   ishonch 0.9431
distilbert-base-cased-...     (65M)   →  'November 1 , 1996'   ishonch 0.7879
```

> ## 🤔 **IKKALA MODEL HAM BIR XIL JAVOB BERDI — kursdagidan BOSHQA.**

### 🔬 Kim haq?

Matnda **ikkita** sana bor:

```
① "first released on November 1, 1996 in Japan"
      ↑
   DVD FORMATI birinchi marta chiqarilgan sana

② "The first DVD player and disc were released in the
    United States on March 24, 1997"
      ↑
   DVD PLEYER va DISK AQSHda chiqarilgan sana
```

> ## 🎯 **SAVOL: "When was the first DVD released?"**
>
> ```
> Agar "DVD" = FORMAT        →  November 1, 1996   ✅ modelning javobi
> Agar "DVD" = pleyer/disk   →  March 24, 1997     ← kursning javobi
> ```
>
> ## 💥 **SAVOLNING O'ZI NOANIQ.** Ikkala javob ham **himoyalanadi** — va model **birinchisini** tanladi, chunki matnda `"first released"` iborasi **aynan** November jumlasida turibdi.

### ⚠️ Nima uchun kursda boshqacha chiqqan?

```
Ehtimoliy sabablar:
  ① O'qituvchining answer_document matni BOSHQACHA bo'lgan
     (masalan, November jumlasi bo'lmagan)
  ② transformers/model versiyasi farqi
```

> ## 🔑 **VA MANA ENG QIMMATLI SABOQ:**
>
> ```
> ❌ "Model xato qildi"
> ✅ "SAVOL noaniq edi, model himoyalanadigan javob tanladi"
> ```
>
> ## 💡 **Amaliy oqibat:** QA tizimini baholayotganda, **avval SAVOLINGIZ aniq ekanini** tekshiring. Ko'p "model xatosi" aslida **noaniq savol** bo'lib chiqadi.

### 🔍 TOP-5 nomzod buni TASDIQLAYDI

```
TOP-5 START (bert-large):
    43  november        7.89
    46  1996            4.22
    42  on              2.35
    40  first           2.24
    82  march           1.95      ← kursning javobi, 5-o'rinda
```

> ## 💥 **`march` — RO'YXATDA BOR, lekin 5-o'rinda** *(1.95 vs 7.89)*.
>
> ## 🔑 **Model IKKALA variantni ham "ko'rgan"** va `november` ni **4 baravar** ishonchliroq deb topgan. Bu — **e'tibor mexanizmi** *(30-modul)* ish ustida.

---

## 5. 📊 Ballarni vizualizatsiya qilamiz

> **"Keling, turli tokenlarni va ularning start yoki end token sifatida tanlanish ehtimolini vizualizatsiya qilaylik."**

```python
import matplotlib.pyplot as plt

start_ballar = chiqish.start_logits.detach().numpy().flatten()
end_ballar = chiqish.end_logits.detach().numpy().flatten()

# ⭐ Tokenlarni NOYOB qilamiz (x o'qi uchun)
token_yorliqlari = [f"{t}-{i}" for i, t in enumerate(tokenlar)]

fig, o = plt.subplots(2, 1, figsize=(16, 8))
o[0].bar(range(len(tokenlar)), start_ballar, color="#38bdf8")
o[0].set_title("START ballari")
o[1].bar(range(len(tokenlar)), end_ballar, color="#4ade80")
o[1].set_title("END ballari")
for ax in o:
    ax.set_xticks(range(len(tokenlar)))
    ax.set_xticklabels(token_yorliqlari, rotation=90, fontsize=7)
    ax.grid(axis="x", alpha=0.3)
plt.tight_layout()
plt.show()
```

> **"Endi bizda bu grafik bor. Siz har bir so'zning START tokeni sifatida tanlanish ehtimolini ko'rishingiz mumkin. Model bir nechta variantni ko'rib chiqqanini ko'ramiz, lekin oxir-oqibat u `March` ni javobning to'g'ri boshlanish so'zi sifatida ANIQ topdi."**

### 💡 Nima uchun tokenlarga indeks qo'shiladi?

> **"Biz tokenlarni x o'qi yorliqlari sifatida ishlatamiz. Buning uchun ularning hammasi NOYOB bo'lishi kerak."**

```
❌ ['the', 'dvd', ..., 'the', 'dvd', ...]     →  takrorlanadi
✅ ['the-1', 'dvd-2', ..., 'the-45', ...]     →  NOYOB
```

> ## ⚠️ **`matplotlib` takroriy yorliqlarni to'g'ri joylashtira olmaydi** — shuning uchun indeks qo'shiladi.

---

## 6. ⭐ Ballarni SON bilan ko'ramiz

Grafik chizishning **oddiyroq** muqobili — eng yuqori nomzodlarni **jadval** qilib chiqarish:

```python
import numpy as np

def top_nomzodlar(ballar, tokenlar, n=5):
    idx = np.argsort(ballar)[::-1][:n]
    return [(int(i), tokenlar[i], round(float(ballar[i]), 2)) for i in idx]

print("START nomzodlari:")
for i, t, b in top_nomzodlar(start_ballar, tokenlar):
    print(f"   {i:3d}  {t:12s} {b:7.2f}")

print("\nEND nomzodlari:")
for i, t, b in top_nomzodlar(end_ballar, tokenlar):
    print(f"   {i:3d}  {t:12s} {b:7.2f}")
```

> ## 🔑 **Bu jadval grafikdan KO'RA foydaliroq** — chunki u **aniq raqamlarni** beradi va **nosozlik tuzatishda** ishlatiladi.
>
> ## 💡 **Agar birinchi va ikkinchi nomzod ballari YAQIN bo'lsa** — model **ikkilanmoqda**. Bu — **ogohlantirish belgisi**.

---

## 7. ⚠️ Ehtimollikka aylantirish

Kurs **logitlarni** ko'rsatadi. Ularni **ehtimollikka** aylantirish **foydaliroq**:

```python
start_ehtimol = torch.softmax(chiqish.start_logits, dim=-1)[0]
end_ehtimol = torch.softmax(chiqish.end_logits, dim=-1)[0]

ishonch = float(start_ehtimol[start_index] * end_ehtimol[end_index])
print(f"START ishonchi : {float(start_ehtimol[start_index]):.4f}")
print(f"END ishonchi   : {float(end_ehtimol[end_index]):.4f}")
print(f"UMUMIY ishonch : {ishonch:.4f}")
```

> ## 🔑 **UMUMIY ISHONCH = start × end.**
>
> ```
> ishonch > 0.5   →  ✅ ishonchli javob
> ishonch < 0.1   →  ⚠️ model IKKILANMOQDA — tekshiring!
> ```
>
> ## 💡 **32-modul saboqini eslang:** *"ball — 'ishonchim komil' degani, 'men haqman' degani EMAS"*. Lekin **past ball** — deyarli doim **muammo belgisi**.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** BERT javobni qanday topadi?

**M2.** Nima uchun `+ 1` kerak?

**M3.** `argmax` nima qiladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** U **ikkita raqam** topadi: **START** va **END** pozitsiyalari. Javob — o'sha oraliqdagi tokenlar.

**M2.** Python kesmasi **oxirgi elementni qo'shmaydi** — `end_index + 1` bo'lmasa, javobning **oxirgi tokeni yo'qoladi**.

**M3.** **Eng yuqori ball**ga ega indeksni qaytaradi.

</details>

### 🟡 O'rta

**M4.** ⭐ Eng yuqori 5 ta nomzodni chiqaring.

**M5.** Umumiy ishonchni hisoblang.

<details>
<summary>✅ Javoblar</summary>

**M4.** 6-bo'limdagi `top_nomzodlar()` funksiyasini ishlating.

**M5.**
```python
sp = torch.softmax(chiqish.start_logits, dim=-1)[0]
ep = torch.softmax(chiqish.end_logits, dim=-1)[0]
print(f"ishonch: {float(sp[start_index] * ep[end_index]):.4f}")
```

</details>

### 🔴 Qiyin

**M6.** ⭐⭐ Model **javobni bilmaydigan** savol bering.

<details>
<summary>✅ Yechim</summary>

```python
def javob_ber(savol, kontekst, batafsil=True):
    k = tokenizer.encode_plus(savol, kontekst, truncation=True, max_length=512)
    ids, seg = k["input_ids"], k["token_type_ids"]
    tks = tokenizer.convert_ids_to_tokens(ids)
    with torch.no_grad():
        o = model(torch.tensor([ids]), token_type_ids=torch.tensor([seg]))
    si, ei = int(torch.argmax(o.start_logits)), int(torch.argmax(o.end_logits))
    sp = torch.softmax(o.start_logits, -1)[0]
    ep = torch.softmax(o.end_logits, -1)[0]
    ishonch = float(sp[si] * ep[ei])

    if batafsil:
        print(f"❓ {savol}")
        print(f"   start={si} end={ei}  ishonch={ishonch:.4f}")
    if ei < si:
        return "⚠️ Javob topilmadi (end < start)", ishonch
    if tks[si] == "[CLS]":
        return "⚠️ Javob topilmadi (model [CLS] ni tanladi)", ishonch
    return " ".join(tks[si:ei + 1]), ishonch


for s in ["When was the first DVD released?",
          "Who invented the DVD?",
          "What is the capital of Uzbekistan?"]:     # ← kontekstda YO'Q
    j, i = javob_ber(s, hujjat)
    print(f"   → {j!r}\n")
```

> ## 🔑 **UCHINCHI SAVOL — ENG MUHIMI.**
>
> Kontekstda O'zbekiston haqida **hech narsa yo'q**. Model nima qiladi?
>
> ```
> ✅ Yaxshi holat  →  [CLS] ni tanlaydi (= "javob yo'q" signali)
>                     yoki ishonch JUDA PAST bo'ladi
>
> ⚠️ Yomon holat   →  tasodifiy bo'lakni qaytaradi
> ```
>
> ## 💡 **SQuAD 1 modellari "javob yo'q" deb o'qitilmagan** — ular **doim** biror narsa qaytaradi. Shuning uchun **ikkita himoya** kerak:
> ```
> ① tks[si] == "[CLS]"     →  model "javob yo'q" signalini berdi
> ② ishonch < chegara      →  model ikkilanmoqda
> ```
>
> ## ✅ **Yaxshiroq yechim — SQuAD 2 modeli** *(`deepset/roberta-base-squad2`)*. U **maxsus** "javob yo'q" holatiga **o'qitilgan**.

</details>

---

## 📌 Xulosa

```
BERT JAVOBNI QANDAY TOPADI?

  ① start_logits  →  har token: "javob SHU YERDA boshlanadimi?"
  ② end_logits    →  har token: "javob SHU YERDA tugaydimi?"
  ③ argmax        →  eng yuqori ballli indekslar
  ④ tokenlar[start : end+1]   ←  ⚠️ +1 SHART!


NATIJA
  Savol : "When was the first DVD released?"
  Javob : "march 24 , 1997"          ✅

  💡 Matnda IKKITA sana bor edi (1996 va 1997) —
     model TO'G'RISINI tanladi (e'tibor mexanizmi, 30-modul)


ISHONCH (kurs ko'rsatmaydi, lekin MUHIM)
  ishonch = softmax(start)[si] × softmax(end)[ei]

  > 0.5   →  ✅ ishonchli
  < 0.1   →  ⚠️ model IKKILANMOQDA


⚠️ "JAVOB YO'Q" HOLATI
  SQuAD 1 modeli DOIM biror narsa qaytaradi
  ✅ ikkita himoya: [CLS] tekshiruvi + ishonch chegarasi
  ✅ yaxshiroq: SQuAD 2 modeli (deepset/roberta-base-squad2)
```

---

⬅️ [Oldingi: BERT embeddinglari](04-BERT-Embeddings.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: QA bot yaratish](06-Creating-a-QA-Bot.md)
