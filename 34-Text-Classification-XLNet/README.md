# 🎯 34-modul. XLNet bilan matn tasnifi

> ## ⭐⭐ **KURSDAGI ENG QIMMATLI MAHORAT — FINE-TUNING.**
>
> Oldingi modullarda **tayyor** modellarni **ishlatdik**. Bu modulda **o'z modelingizni yaratasiz**.

---

## 📚 Darslar

| # | Dars | Nima o'rganasiz |
|---|---|---|
| 1 | [GPT, BERT va XLNet](01-GPT-vs-BERT-vs-XLNet.md) | Permutatsiya, mustaqillik farazi |
| 2 | [Ma'lumotni tayyorlash](02-Preprocessing-Our-Data.md) ⭐⭐ | Tozalash, muvozanat, ## **bazaviy chiziq** |
| 3 | [XLNet embeddinglari](03-XLNet-Embeddings.md) ⭐ | ## **Chapdan to'ldirish**, `<cls>` oxirda |
| 4 | [XLNet'ni fine-tune qilamiz](04-Fine-Tuning-XLNet.md) ⭐⭐⭐ | `Trainer`, ## **ikkita API o'zgargan** |
| 5 | [Modelni baholaymiz](05-Evaluating-Our-Model.md) ⭐⭐⭐ | Chalkashlik matritsasi, ishonch chegarasi |

---

## 📝 Amaliyot

| | |
|---|---|
| 📝 [**40 ta mashq**](MASHQLAR.md) | 🟢 Oson · 🟡 O'rta · 🔴 Qiyin |
| 🚀 [**6 ta mini-loyiha**](LOYIHALAR.md) | Tozalash tadqiqotchisi · ⭐ **o'rganish egri chizig'i** · xato tahlilchisi · model stendi · ishlab chiqarish xizmati · 🇺🇿 o'zbekcha tasniflagich |

---

## ⚙️ O'rnatish

```bash
pip install transformers torch pandas numpy scikit-learn matplotlib
pip install datasets evaluate clean-text sentencepiece accelerate
```

> ## ⚠️ **BEShTA PAKET KURSDA AYTILMAGAN, LEKIN SHART:**
> ```
> datasets · evaluate · clean-text
> sentencepiece  →  XLNetTokenizer BUSIZ ishlamaydi
> accelerate     →  Trainer BUSIZ ishlamaydi
> ```

---

## 🧭 Uchta model bir rasmda

![Uchta model](assets/01-uch-model.svg)

```
GPT     "keyingi so'z nima?"           →  chapdan o'ngga
BERT    "[MASK] nima edi?"             →  ikki tomonga, LEKIN sun'iy token
XLNet   "SHU TARTIBDA keyingisi nima?" →  ikki tomonga, tokensiz  ⭐
```

> ## ⚠️ **HALOL OGOHLANTIRISH:** XLNet 2019-da BERT'ni yengdi, lekin **bugun kam ishlatiladi** — RoBERTa/DeBERTa/ELECTRA undan o'zib ketdi.
>
> ## 🔑 **SHUNDA NIMA UCHUN O'RGANAMIZ?** Chunki bu modulda asosiy mavzu **XLNet emas** — ## **`Trainer` OQIMI**. U **har qanday** modelga *(BERT, RoBERTa, XLM-R, hattoki LLaMA)* **bir xil** ishlaydi. 5-darsda `xlm-roberta-base` ga o'tish **bitta satr** ekanini ko'rasiz.

---

## 💥💥 Modulning eng muhim topilmasi

### Kurs retsepti TASODIFDAN YOMONROQ ishlaydi

![Natijalar](assets/05-natijalar.svg)

Kursning aynan sozlamalarini **ishga tushirdik va o'lchadik**:

| | **KURS RETSEPTI** | **TUZATILGAN** |
|---|---|---|
| Namuna | 100 | ## **1200** |
| `max_length` | 128 | ## **64** |
| **Aniqlik** | ## 💥 **0.1800** | ## ✅ **0.6450** |
| Loss | 1.4597 | ## **0.9278** |
| Vaqt | 1.9 daqiqa | 11.1 daqiqa |
| Bazaviy *(0.25)* ga | ## ❌ **0.72×** | ## ✅ **2.58×** |

```
KURS (100 namuna)                  TUZATILGAN (1200 namuna)
─────────────────                  ────────────────────────
epoxa 1:  0.2100  loss 1.424       epoxa 1:  0.2900  loss 1.377
epoxa 2:  0.1800  loss 1.437       epoxa 2:  0.5475  loss 1.102
epoxa 3:  0.1800  loss 1.460       epoxa 3:  0.6450  loss 0.928
          ↓            ↑                     ↑            ↓
       TUSHDI       O'SDI                 O'SDI       TUSHDI
```

> ## 🔑 **BU IKKI USTUN — BUTUN MODULNING SABOG'I:**
> ```
> aniqlik ↑  va  loss ↓   →  ✅ model O'RGANMOQDA
> aniqlik ↓  va  loss ↑   →  💥 model YOMONLASHMOQDA
> ```
>
> ## ⚠️ **Kurs *"muvaffaqiyatli fine-tune qildik"* deydi va RAQAMNI KO'RSATMAYDI.** Biz ko'rsatamiz.

---

## ⚠️ Kursdan TOPILGAN farqlar

### ① Ikkita `Trainer` API o'zgargan

```
❌ TrainingArguments(evaluation_strategy="epoch")   →  TypeError
✅ TrainingArguments(eval_strategy="epoch")

❌ Trainer(..., tokenizer=tokenizer)                →  TypeError
✅ Trainer(..., processing_class=tokenizer)
```

### ② pandas 3 da kursning muvozanatlash kodi JIM SINADI

```python
data.groupby("label").apply(lambda x: x.sample(k)).reset_index(drop=True)
#  →  ustunlar: ['text', 'text_clean']      ❗ 'label' YO'Q
```

pandas 3 da `groupby.apply` **guruhlash ustunini qaytarmaydi**. To'g'risi — `groupby(..., group_keys=False).sample(n=k)`.

### ③ `token_type_ids` endi qaytarilmaydi

Kurs 4-darsning katta qismini `token_type_ids` qiymatlariga bag'ishlaydi *(pad=3, jumla=0, maxsus=2)*. `transformers` 5.x da XLNet tokenizatori uni **bitta** matn uchun **bermaydi**. Kod **baribir ishlaydi**.

### ④ `cleaner` KATTA HARFNI ham o'chiradi

```
asl    : "Just got back from seeing @GaryDelaney ... AMAZING!!"
keyin  : "just got back from seeing garydelaney ... amazing"
```

Biz `xlnet-base-**cased**` ishlatamiz — ya'ni **cased modelning ustunligi yo'qoladi**. Tuzatish: `cleaner(t, no_emoji=True, lower=False)`.

### ⑤ `max_length=128` — 81% hisoblash ISROF

```
o'rtacha uzunlik  : 24.2 token
eng uzun matn     : 51 token
max_length        : 128 token
                    → 81.1% <pad> ga sarflanadi
```

`max_length=64` — hech nima kesilmaydi, e'tibor **4× tezroq** *(O(n²))*.

---

## ⭐⭐ Kursda YO'Q, biz qo'shgan narsalar

### 📏 Bazaviy chiziq

```
tasodifiy (4 sinf)        →  25.0%
har doim 'fear' (asl)     →  31.7%
```

> ## 🔑 **Bu — "hech nima o'rganmagan" modelning natijasi.** Har bir aniqlikni **shu bilan** solishtiring. Kurs buni **hisoblamaydi**.

### 🔬 Chalkashlik matritsasi — o'rtacha aytmagan narsalar

```
         anger  fear  joy  sadness   to'g'ri_%
anger       53    10   16       23      52.0    ⚠️
fear        14    54   12       21      53.5    ⚠️
joy          6     4   73        6      82.0    ✅
sadness     10    11    9       78      72.2    ✅
```

```
Eng ko'p chalkashadigan juftliklar:
   23 marta:  anger   → sadness
   21 marta:  fear    → sadness
   16 marta:  anger   → joy
   14 marta:  fear    → anger
```

> ## 💥 **MODEL "IJOBIY vs SALBIY" NI O'RGANDI, LEKIN SALBIYLARNI AJRATA OLMADI.**
>
> `joy` — **yagona ijobiy** sinf, shuning uchun **82%**. Qolgan uchtasi bir-biriga **semantik yaqin**.
>
> ## ✅ **AMALIY XULOSA:** agar biznesga faqat "ijobiy/salbiy" kerak bo'lsa — **vazifani soddalashtiring**. Bu modelni yaxshilashdan **arzonroq**.

### 🛡️ Ishonch chegarasi

```
I am so happy today...        →  joy      0.8444   ✅
This makes me furious         →  anger    0.7434   ✅
I am terrified of what...     →  fear     0.7291   ✅
I miss them so much it hurts  →  anger    0.3238   ❌ XATO (sadness edi)
The train leaves at 7pm       →  sadness  0.4166   ❌ NEYTRAL matn
```

> ## 🔑 **ISHONCH IKKALA XATONI HAM FOSH QILDI:** to'g'ri javoblar **0.73–0.84**, xatolar **0.32–0.42**.
>
> ## ⚠️ **NEYTRAL MATN MUAMMOSI** — *"The train leaves at 7pm"* da hissiyot **yo'q**, lekin model **4 tadan birini** tanlashga **majbur**. Bu — 33-moduldagi *"model bilmayman deya olmaydi"* muammosining **takrori**.

---

## 🇺🇿 O'zbek tili — halol o'lchandi

```
Bugun juda xursandman     → sadness  0.3671   ❌
Bu meni g'azablantirdi    → sadness  0.6953   ❌
Kelajakdan qo'rqaman      → fear     0.5923   ✅
Ularni juda sog'indim     → sadness  0.4977   ✅
```

> ## 💥 **2/4 — BU TASODIF.** Bazaviy chiziq 25%, ya'ni 4 tadan 1 tasi tasodifan to'g'ri chiqishi **kutiladi**.

### 🔬 Sabab — tokenizator

```python
tokenizer.tokenize("Bugun juda xursandman")
```
```
['▁Bug', 'un', '▁', 'ju', 'da', '▁x', 'ur', 's', 'and', 'man']
```

> ## 💥 **UCHTA SO'Z — 10 TA MA'NOSIZ BO'LAKKA.** `xlnet-base-cased` lug'atida o'zbekcha **yo'q**.

> ## ✅ **YECHIM — MODELNI ALMASHTIRING, KODNI EMAS:**
> ```python
> MODEL = "xlm-roberta-base"     # 100 tilda oldindan o'qitilgan
> #  ...qolgan HAMMA KOD BIR XIL...
> ```
>
> ## 🏆 **MANA SHU MODULNING ASOSIY QIYMATI.** `Trainer` oqimi **modeldan mustaqil**.
>
> ## ⚠️ **Sizga o'zbekcha yorliqlangan ma'lumot kerak** — kamida **200 misol/sinf**. [6-loyiha](LOYIHALAR.md) tayyor shablon beradi.

---

## 📊 Ma'lumot yo'li

![Tayyorlash](assets/03-tayyorlash.svg)

```
3 CSV (7102)  →  concat  →  cleaner  →  re.sub  →  muvozanat (6132)
                                                        ↓
                                              LabelEncoder (anger=0 ...)
                                                        ↓
                                          train 4414 / val 491 / test 1227
```

---

## 🔍 XLNet vs BERT — tokenlash

![Tokenlash](assets/02-tokenlash.svg)

| | 🔵 **BERT** | 🟢 **XLNet** |
|---|---|---|
| Tokenizator | WordPiece `##` | SentencePiece `▁` |
| Lug'at | 30,522 | **32,000** |
| To'ldirish | o'ngga | ## **chapga** |
| Tasnif tokeni | `[CLS]` **boshida** | ## `<cls>` **oxirida** |
| `pad_token_id` | 0 | ## **5** |
| Tasnif vektori | `hidden[0]` | ## `hidden[-1]` |

> ## 💥 **BERT'dan ko'chirilgan `input_ids[0]` kodi XLNet'da `<pad>` ni oladi — xato CHIQMAYDI.**

---

## 🎓 Modulni tugatgach

```
✅ O'z ma'lumotingizda modelni fine-tune qila olasiz
✅ Bazaviy chiziqni hisoblaysiz va u bilan solishtirasiz
✅ aniqlik ↑ / loss ↓ naqshini o'qiy olasiz
✅ Chalkashlik matritsasi bilan ZAIF sinfni topasiz
✅ Ishonch chegarasi bilan ISHONCHLI xizmat quradingiz
✅ Modelni saqlash/yuklashda tokenizatorni UNUTMAYSIZ
✅ Bashoratda O'QITISHDAGI tozalashni takrorlaysiz
✅ Boshqa tilga o'tish BITTA SATR ekanini bilasiz
```

---

## 🔗 Bog'liq modullar

| Modul | Aloqasi |
|---|---|
| [30-modul](../30-Transformer-Architecture/README.md) | E'tibor mexanizmi, `O(n²)` narxi |
| [32-modul](../32-HuggingFace-Transformers/README.md) | `Auto` sinflari, `save_pretrained`, tokenizator mosligi |
| [33-modul](../33-BERT-Question-Answering/README.md) | ⚖️ Ishonch chegarasi — **bir xil g'oya** |
| [35-modul](../35-LangChain-Introduction/README.md) | ➡️ **Keyingi:** LangChain |
| [62–67-modul](../62-LLM-Engineering-Introduction/README.md) | Shu modelni **Streamlit** ilovasiga aylantirasiz |

---

⬅️ [33-modul. BERT savol-javob](../33-BERT-Question-Answering/README.md) · 🏠 [Bosh sahifa](../README.md) · ➡️ [35-modul. LangChain](../35-LangChain-Introduction/README.md)
