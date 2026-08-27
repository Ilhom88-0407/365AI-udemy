# 1-dars. OpenAI API hisobiga pul qo'shish ⭐

## 🎬 Boshlashdan oldin

> **"Kurs sizdan $5 so'raydi. Biz hisobladik — prompt ishlab chiqishning butun narxi $2.31. Va kalitsiz yo'l bilan — $0."**

---

## 1. Kursning talabi

> ## 🔑 **KURS AYTADI:** ## *"API dan foydalanish uchun hisobingizga **mablag' qo'shishingiz** kerak."*

| Qadam | Tafsilot |
|---|---|
| ① Hisob yaratish | `platform.openai.com` |
| ② To'lov usuli | ## ⚠️ **xalqaro karta** |
| ③ Minimal to'ldirish | ## 💥 **$5** *(qaytarilmaydi)* |
| ④ Kalit yaratish | `sk-...` |
| ⑤ Limit qo'yish | ## ⭐ **SHART — quyida** |

---

## 2. 💥 Va bu — hamma uchun mumkin emas

| To'siq | Kimga tegadi |
|---|---|
| ## Xalqaro karta | ## 💥 **ko'p mamlakatlarda muammo** |
| $5 minimal | Talabalar, o'quvchilar |
| ## Mintaqaviy cheklovlar | ## 💥 **ba'zi davlatlarda bloklangan** |
| Valyuta konvertatsiyasi | Qo'shimcha komissiya |

> ## 🏆 **SHUNING UCHUN BIZ IKKI YO'LNI KO'RSATAMIZ** *(62-modul)*.

---

## 3. ⭐⭐ Prompt ishlab chiqish qancha turadi?

Kurs aytadi: *"Promptni mukammallashtirish uchun **bir oydan ortiq** vaqt va **7 million tokendan** ko'p sarfladik."*

```python
TOK = 7_000_000
for m, (ki, ch) in [("gpt-4o-mini", (0.150, 0.600)), ("gpt-4o", (2.5, 10.0))]:
    n = (TOK * 0.6 * ki + TOK * 0.4 * ch) / 1e6   # 60% kirish / 40% chiqish
    print(f"{m:14s} ${n:8.2f}")
```

```
gpt-4o-mini    $    2.31
gpt-4o         $   38.50
mahalliy       $    0.00
```

> ## 🏆🏆 **7 MILLION TOKEN — `gpt-4o-mini` DA ATIGI $2.31.**
>
> ## ## 💥 **YA'NI MINIMAL $5 TO'LDIRISH — ## BUTUN PROMPT ISHLAB CHIQISH UCHUN YETADI.**

> ## ⚠️ **LEKIN `gpt-4o` DA — $38.50.** ## Ya'ni **model tanlovi** prototip narxini ham belgilaydi. ## ## ⭐ **Prompt sinovi uchun ARZON modelni ishlating**, ## faqat yakuniy tekshiruvni qimmatida qiling.

---

## 4. 🔒 Limit qo'yish — **majburiy** qadam

> ## 💥 **API KALITI — OCHIQ KRAN.** ## Kodda tsikl bo'lsa yoki kalit sizib chiqsa — ## hisob **tez bo'shaydi**.

| Himoya | Qayerda |
|---|---|
| ## **Hard limit** | OpenAI → Billing → Usage limits |
| **Soft limit** *(ogohlantirish)* | O'sha yerda |
| ## **Kodda byudjet nazorati** | ## ⭐ **63-modul, 4-dars** |
| Kalitni `.env` da saqlash | ## ⭐ **hech qachon kodda emas** |
| Kalitni `git` ga qo'ymaslik | ## ⭐ **`.gitignore`** |

### ⚠️ Kalit sizib chiqishining eng ko'p uchraydigan sababi

```
   ① .env faylini git ga qo'shib yuborish        💥 eng ko'p
   ② Jupyter notebook chiqishida kalit ko'rinishi
   ③ Skrinshotda kalit
   ④ Xato xabarida kalit (traceback)
   ⑤ Ommaviy Streamlit ilovasida kalit
```

> ## ⭐ **`.gitignore` GA DARROV QO'SHING:**
>
> ```
> .env
> .env.*
> *.key
> secrets/
> .streamlit/secrets.toml
> ```

---

## 5. 🔧 Kalitni xavfsiz o'qish

```python
import os


def kalit_ol(nom="OPENAI_API_KEY", majburiy=False):
    """Kalitni xavfsiz o'qiydi va TEKSHIRADI.

    Tartib: muhit o'zgaruvchisi -> .env -> Streamlit secrets.
    """
    k = os.environ.get(nom)

    if not k:                                   # ① .env fayli
        try:
            from dotenv import load_dotenv
            load_dotenv()
            k = os.environ.get(nom)
        except ImportError:
            pass

    if not k:                                   # ② Streamlit secrets
        try:
            import streamlit as st
            k = st.secrets.get(nom)
        except Exception:
            pass

    if not k:
        if majburiy:
            raise RuntimeError(
                f"💥 {nom} topilmadi.\n"
                f"   .env fayl yarating: {nom}=sk-...\n"
                f"   yoki mahalliy modelga o'ting (kalit kerak emas)")
        return None

    # ⚠️ shakl tekshiruvi — xato kalitni erta tutish uchun
    if not k.startswith("sk-") or len(k) < 20:
        raise ValueError(f"💥 {nom} shakli noto'g'ri: {k[:6]}...")
    return k


def kalit_yashir(k):
    """Log va xato xabarlarida ko'rsatish uchun."""
    if not k:
        return "—"
    return f"{k[:7]}...{k[-4:]}  ({len(k)} belgi)"
```

```python
k = kalit_ol(majburiy=False)
print(f"kalit: {kalit_yashir(k)}")
print(f"rejim: {'OpenAI' if k else 'MAHALLIY (kalitsiz)'}")
```

### ✅ Haqiqiy natija *(kalitsiz muhitda)*

```
kalit: —
rejim: MAHALLIY (kalitsiz)
```

> ## 🏆 **VA BU — TO'G'RI XULQ.** ## Kod **yiqilmaydi**, u **mahalliy rejimga** o'tadi.
>
> ## ## ⭐ **62-MODULDAGI `LLMAdapter` BILAN BIRGA:**
>
> ```python
> k = kalit_ol()
> llm = LLMAdapter("openai", api_key=k) if k else LLMAdapter("mahalliy")
> ```

---

## 6. ⚠️ Va bir necha amaliy maslahat

| Maslahat | Nega |
|---|---|
| ## **Alohida loyiha kaliti** | Sizib chiqsa — **bittasini** bekor qilasiz |
| ## **Har oy aylantirish** | Eski kalit **ishlamay qoladi** |
| Foydalanishni kuzatish | Kutilmagan o'sishni **darrov ko'rasiz** |
| ## **Test uchun alohida hisob** | ## ⭐ **ishlab chiqarishga tegmaydi** |
| `max_tokens` har doim | ## ⭐ **cheksiz chiqishning oldini oladi** |

> ## 💥 **VA ENG MUHIMI — TSIKL ICHIDA API CHAQIRMANG,** ## chiqish sharti **aniq** bo'lmasa. ## ## 🔑 63-modulning 9-darsida aynan shu bo'shliqni topgan edik.

---

## 🎯 Nazorat savollari

1. Kurs qancha to'ldirishni talab qiladi?
2. 7 million token qancha turadi?
3. Kalit sizib chiqishining eng ko'p uchraydigan sababi nima?
4. `kalit_ol()` kalit topilmasa nima qiladi?
5. Nima uchun test va ishlab chiqarish uchun alohida hisob kerak?

<details>
<summary>Javoblar</summary>

1. ## **$5** *(minimal, qaytarilmaydi)* + xalqaro karta. Ko'p mamlakatlarda bu **to'siq**.
2. ## **$2.31** — `gpt-4o-mini` bilan. `gpt-4o` bilan esa **$38.50** *(16.7×)*. Ya'ni $5 to'ldirish **butun prompt ishlab chiqish** uchun yetadi — arzon modelda.
3. ## **`.env` faylini `git` ga qo'shib yuborish.** Keyin: notebook chiqishi, skrinshot, traceback, ommaviy Streamlit ilovasi.
4. **Yiqilmaydi** — `None` qaytaradi *(agar `majburiy=False`)*, va kod **mahalliy rejimga** o'tadi. `majburiy=True` bo'lsa — **tushunarli xato** beradi.
5. Test hisobi sizib chiqsa yoki limitga yetsa — **ishlab chiqarish ishlashda davom etadi**. Bitta hisob bilan — hammasi **birga to'xtaydi**.

</details>

---

⬅️ [63-modul](../63-LLM-Planning-Stage/README.md) · 🏠 [Modul](README.md) · ➡️ [2-dars](02-The-OpenAI-Playground.md)
