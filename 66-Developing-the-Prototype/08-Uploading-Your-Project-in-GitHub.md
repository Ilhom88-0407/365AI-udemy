# 8-dars. Loyihani GitHub ga yuklash ⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs aytadi: 'hech qachon API kalitingizni GitHub ga yuklamang'. To'g'ri. Keyin u aynan shu buyruqni beradi: `git add .` — biz uni ishga tushirdik, va kalit qo'shildi."**

---

## 1. Kursning ogohlantirishi — **to'g'ri**

> *"API kalitlaringizni GitHub ga hech qachon yuklamang. Kraulerlar deb ataladigan avtomatik botlar ochiq repozitoriylarni maxfiy ma'lumot uchun skanerlaydi. Agar bu kalitlar oshkor bo'lsa, ruxsatsiz foydalanuvchilar ularni ishlatib, mablag'ingizni tugatishi mumkin."*

> ## ✅ **BU — MUTLAQO TO'G'RI VA JUDA MUHIM.**

---

## 2. 💥💥💥 **LEKIN KURSNING BUYRUG'I AYNAN SHUNI QILADI**

Kurs beradigan qadamlar:

```bash
git init
git add .
git commit -m "initial commit"
git branch -m main
git remote add origin <URL>
git push -u origin main
```

> ## 💥 **`.gitignore` — UMUMAN ESLATILMAYDI.**

### 🔬 **Sinaymiz — `git add .` nima qo'shadi?**

```bash
mkdir -p loyiha/.streamlit && cd loyiha
echo 'OPENAI_API_KEY = "sk-proj-SOXTA123"' > .streamlit/secrets.toml
echo 'import streamlit as st' > app.py

git init
git add .
git status --short
```

### ✅ Haqiqiy natija

```
A  .streamlit/secrets.toml
A  app.py
```

> ## 💥💥💥 **`secrets.toml` — QO'SHILDI.**
>
> ## Ya'ni `git push` dan **keyin** ## sizning kalitingiz ## ⭐ **ochiq internetda**.

> ## 🔑 **VA 9-DARSDA KURS AYTADI:** ## *"Streamlit Community Cloud faqat ## **ochiq (public)** repozitoriylarni hostlaydi"*. ## ## 💥 Ya'ni kalit **hamma uchun** ko'rinadi.

---

## 3. 💥💥 **VA UNI O'CHIRISH — YETARLI EMAS**

Aytaylik, xatoni sezdingiz va faylni o'chirdingiz:

```bash
echo '.streamlit/secrets.toml' > .gitignore
git rm --cached .streamlit/secrets.toml
git add .
git commit -m "remove secrets"
git status --short
```

```
(bo'sh — ishchi katalog toza)
```

### 🔬 Lekin **tarixda** nima qoldi?

```bash
git log --all --oneline -- .streamlit/secrets.toml
git show HEAD~1:.streamlit/secrets.toml
```

### ✅ Haqiqiy natija

```
644afbe remove secrets
6d1eba3 initial commit
--- tarixdan o'qiymiz ---
OPENAI_API_KEY = "sk-proj-SOXTA123"
```

> ## 💥💥💥 **KALIT TARIXDA — VA UNI HAR KIM O'QIY OLADI.**
>
> ## ⭐ Bitta buyruq: `git show HEAD~1:.streamlit/secrets.toml`

> ## 🏆 **YAGONA TO'G'RI YO'L — KALITNI BEKOR QILISH:** ## ① OpenAI panelida **eski kalitni o'chiring**, ## ② **yangisini** yarating, ## ③ keyin `.gitignore` qo'shing.
>
> ## ## ⚠️ **Tarixni tozalash** *(`git filter-repo`, `BFG`)* — ## mumkin, lekin ## 💥 **kalit allaqachon skanerlangan bo'lishi mumkin**.

---

## 4. ✅ To'g'ri tartib — **`.gitignore` BIRINCHI**

```bash
git init
```

Keyin **darhol** `.gitignore`:

```gitignore
# 💥 MAXFIY
.streamlit/secrets.toml
.env
*.key

# Python
__pycache__/
*.pyc
.venv/
venv/

# IDE
.vscode/
.idea/
```

```bash
git add .
git status --short
```

### ✅ Haqiqiy natija

```
A  .gitignore
A  app.py
```

```
git check-ignore tekshiruvi:
.streamlit/secrets.toml      IGNORED
app.py                       kuzatiladi
__pycache__/a.pyc            IGNORED
```

> ## 🏆🏆 **`secrets.toml` VA `__pycache__` — QO'SHILMADI.** ## ⭐ `app.py` esa — **kuzatiladi**.

### 🔧 Tekshiruv buyrug'i — **push dan oldin**

```bash
git check-ignore -v .streamlit/secrets.toml
```

```
.gitignore:2:.streamlit/secrets.toml	.streamlit/secrets.toml
```

> ## ⭐ **AGAR HECH NARSA CHIQMASA — FAYL KUZATILADI.** ## ## 💥 To'xtang va `.gitignore` ni tekshiring.

---

## 5. 🔧 Push oldidan **avtomatik tekshiruv**

```python
import re
import subprocess

NAQSHLAR = {
    "OpenAI kaliti": r"sk-[A-Za-z0-9_\-]{20,}",
    "AWS kaliti": r"AKIA[0-9A-Z]{16}",
    "Umumiy sir": r"(?i)(api[_-]?key|secret|password)\s*[=:]\s*['\"][^'\"]{8,}",
}


def push_oldidan():
    """Staged fayllarda sir bormi?"""
    fayllar = subprocess.run(
        ["git", "diff", "--cached", "--name-only"],
        capture_output=True, text=True).stdout.split()

    topilgan = []
    for f in fayllar:
        try:
            matn = open(f, encoding="utf-8", errors="ignore").read()
        except OSError:
            continue
        for nom, n in NAQSHLAR.items():
            if re.search(n, matn):
                topilgan.append(f"💥 {f}: {nom}")
    return topilgan or ["✅ sir topilmadi"]
```

```python
for x in push_oldidan():
    print(x)
```

### ✅ Haqiqiy natija

```
--- toza loyiha ---
✅ sir topilmadi

--- secrets.toml qo'shilgandan keyin ---
💥 secrets.toml: OpenAI kaliti
💥 secrets.toml: Umumiy sir
```

> ## 🏆 **IKKITA NAQSH BIR VAQTDA TUTDI** — ## `sk-` prefiksi **va** `API_KEY = "..."` shakli. ## ## ⭐ **Ortiqchalik (redundancy) — ataylab:** ## bitta naqsh o'tkazib yuborsa, ## boshqasi **tutadi**.

> ## ⭐ **BUNI `pre-commit` HOOK GA QO'YISH MUMKIN:** ## `.git/hooks/pre-commit`. ## ## 🏆 Shunda **unutish imkonsiz** bo'ladi.

---

## 6. ⭐ Git buyruqlari — kurs bergan tartib

| Buyruq | Nima qiladi |
|---|---|
| `git init` | Mahalliy repozitoriy yaratadi |
| ## `git add .` | ## 💥 **HAMMA narsani** staging ga |
| `git commit -m "..."` | Snapshot saqlaydi |
| `git branch -m main` | Shoxni `main` deb qayta nomlaydi |
| `git remote add origin <URL>` | GitHub bilan bog'laydi |
| `git push -u origin main` | Yuklaydi |

### ⚠️ Ikkita aniqlik

| Kurs aytadi | ## Aniqlik |
|---|---|
| `git add all` *(videoda)* | ## 💥 **Bunday buyruq yo'q** — `git add .` yoki `git add -A` |
| `git push u origin main` | ## ⚠️ **`-u`** *(chiziqcha bilan)* |

> ## 💡 **`git add .` vs `git add -A`:** ## `.` — **joriy katalogdan** pastga, ## `-A` — **butun repozitoriy**. ## ⭐ Ildizdan turib ishlatsangiz — **bir xil**.

---

## 7. ⚠️ Ochiq vs yopiq repozitoriy

| | Ochiq *(public)* | Yopiq *(private)* |
|---|---|---|
| Kodni kim ko'radi | ## **hamma** | siz tanlaganlar |
| Streamlit Cloud *(bepul)* | ## ✅ **ha** | ## 💥 **yo'q** |
| Kalit oshkor bo'lish xavfi | ## 💥 **juda yuqori** | pastroq |

> ## 🔑 **KURS OCHIQNI TANLAYDI — VA SABABI BOR:** ## bepul hosting **shuni talab qiladi**.
>
> ## ## ⚠️ **LEKIN BU DEMAK:** ## `.gitignore` — **majburiy**, tavsiya emas.

---

## 🎯 Nazorat savollari

1. `git add .` nima qo'shadi?
2. Faylni `git rm --cached` bilan o'chirsangiz, kalit xavfsizmi?
3. Oshkor bo'lgan kalit bilan nima qilish kerak?
4. `.gitignore` qaysi qadamda yaratiladi?
5. Nega kurs ochiq repozitoriyni tanlaydi?

<details>
<summary>Javoblar</summary>

1. ## **Hamma narsani** — shu jumladan `.streamlit/secrets.toml` ni. 💥 O'lchandi: `A  .streamlit/secrets.toml`. ⭐ Kurs `.gitignore` ni **umuman eslatmaydi**.
2. ## **Yo'q.** Fayl **tarixda qoladi**: `git show HEAD~1:.streamlit/secrets.toml` → `OPENAI_API_KEY = "sk-proj-..."`. 💥 Har kim o'qiy oladi.
3. ## **Darhol bekor qiling** *(revoke)* va yangisini yarating. ⚠️ Tarixni tozalash mumkin (`git filter-repo`, `BFG`), lekin kalit **allaqachon skanerlangan** bo'lishi mumkin.
4. ## **`git init` dan keyin, `git add` dan OLDIN.** ⭐ Tekshirish: `git check-ignore -v .streamlit/secrets.toml` — javob bo'lmasa, fayl **kuzatiladi**.
5. Streamlit Community Cloud **bepul hosting** faqat **ochiq** repozitoriylar uchun. ⚠️ Shuning uchun `.gitignore` — **majburiy**.

</details>

---

⬅️ [7-dars](07-Feedback-Functionality-Part-2.md) · 🏠 [Modul](README.md) · ➡️ [9-dars](09-Deploying-Your-Streamlit-App.md)
