# 6-dars. Fikr-mulohaza funksiyasi, 1-qism ⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kursning kodi 5 ta javobga ruxsat beradi, lekin 4 tasiga javob qaytaradi. Foydalanuvchining ENG OXIRGI javobi — javobsiz qoladi. Biz buni o'lchadik."**

---

## 1. Uchta shartli o'tish

```text
if (st.session_state.setup_complete
        and not st.session_state.feedback_shown
        and not st.session_state.chat_complete):
    # SUHBAT bosqichi
```

| Shart | Ma'nosi |
|---|---|
| `setup_complete` | Sozlash **tugadi** |
| `not feedback_shown` | Fikr-mulohaza **hali ko'rsatilmagan** |
| `not chat_complete` | Suhbat **hali tugamagan** |

> ## ⭐ **UCHALASI `and` BILAN** — ## faqat **hammasi bajarilsa** suhbat ko'rinadi.

---

## 2. ⭐ `if not st.session_state.messages:`

```python
if not st.session_state.messages:            # ⭐ ro'yxat BO'SHMI?
    st.session_state.messages = [{"role": "system", "content": "..."}]
```

Kurs buni videoda tushuntiradi:

> *"Bu dastlab qarama-qarshi tuyulishi mumkin, lekin bo'sh ro'yxat Boolean kontekstda `False` ga teng."*

| Ifoda | Natija |
|---|---|
| `bool([])` | `False` |
| `bool([1])` | `True` |
| `not []` | ## ⭐ **`True`** |

> ## 🔑 **NEGA `"messages" not in st.session_state` EMAS?** ## Chunki 5-darsda `messages` ## **eng yuqorida** `[]` qilib boshlangan — ## ⭐ ya'ni kalit **allaqachon mavjud**.

---

## 3. 💥💥💥 **BESH XABAR, TO'RT JAVOB**

Kursning kodi:

```python
if st.session_state.user_message_count < 5:              # ① kirish ruxsati
    if prompt := st.chat_input("Your response", max_chars=1000):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        if st.session_state.user_message_count < 4:      # ② javob ruxsati
            with st.chat_message("assistant"):
                stream = client.chat.completions.create(...)
                response = st.write_stream(stream)
            st.session_state.messages.append(
                {"role": "assistant", "content": response})

        st.session_state.user_message_count += 1

if st.session_state.user_message_count >= 5:
    st.session_state.chat_complete = True
```

> ## ⚠️ **E'TIBOR BERING — IKKITA HAR XIL SON:** ## kirish uchun **`< 5`**, javob uchun **`< 4`**.

### 🔬 **O'lchaymiz — nima bo'ladi?**

```python
for i in range(1, 7):
    at.chat_input[0].set_value(f"{i}-javobim").run()
    javoblar = sum(1 for m in at.session_state.messages
                   if m["role"] == "assistant")
    print(f"{i}-xabar: count={at.session_state.user_message_count}  "
          f"assistant javoblari={javoblar}  "
          f"chat_complete={at.session_state.chat_complete}  "
          f"chat_input={len(at.chat_input)}")
```

### ✅ Haqiqiy natija

```
1-xabar: count=1  assistant javoblari=1  chat_complete=False  chat_input=1
2-xabar: count=2  assistant javoblari=2  chat_complete=False  chat_input=1
3-xabar: count=3  assistant javoblari=3  chat_complete=False  chat_input=1
4-xabar: count=4  assistant javoblari=4  chat_complete=False  chat_input=1
5-xabar: count=5  assistant javoblari=4  chat_complete=True   chat_input=1
6-xabar: count=5  assistant javoblari=4  chat_complete=True   chat_input=0
```

```
messages:
   system     HR for Alex / Senior ML Engineer at Spotify
   user       1-javobim
   assistant  HR javobi #1
   user       2-javobim
   assistant  HR javobi #2
   user       3-javobim
   assistant  HR javobi #3
   user       4-javobim
   assistant  HR javobi #4
   user       5-javobim              ← 💥 JAVOBSIZ
```

> ## 💥💥💥 **IKKITA XATO — BIRIDA HAM XATO XABARI YO'Q:**
>
> ## ## ① **5-XABAR JAVOBSIZ QOLADI.** ## Foydalanuvchi javob yozadi, ## ekranda **hech narsa** paydo bo'lmaydi. ## ⭐ U *"ilova qotib qoldi"* deb o'ylaydi.
>
> ## ## ② **6-XABAR BUTUNLAY YUTILADI.** ## `chat_input` hali **ko'rinib turibdi** *(=1)*, ## foydalanuvchi yozadi — ## 💥 xabar **saqlanmaydi ham, javob ham yo'q**.

### 🔑 Nega `chat_input` hali ko'rinadi?

| Rerun | `chat_complete` | `chat_input` chizilganmi |
|---|---|---|
| 5-xabar yuborilgan rerun | ## `False` → `True` **oxirida** | ## 💥 **ha** — u yuqorida chizilgan |
| Keyingi rerun | `True` | ## ✅ yo'q |

> ## 🔑 **`chat_complete = True` SATRI SKRIPTNING PASTIDA.** ## `chat_input` esa — **yuqorida**. ## ## ⭐ Ya'ni o'sha rerunda u **allaqachon chizilgan**.

---

## 4. ✅ Tuzatish — **uchta qator**

### 💥 Kursning mantig'i

```text
if count < 5:              # kirish
    if count < 4:          # javob   💥 BIR KAM
```

| Xabar soni | Javoblar | Javobsiz | Yutilgan |
|---|---|---|---|
| 3 | 3 | 0 | 0 |
| ## **5** | ## 💥 **4** | ## 💥 **1** | 0 |
| ## **6** | ## 💥 **4** | ## 💥 **1** | ## 💥 **1** |
| 8 | 💥 4 | 💥 1 | 💥 3 |

### ✅ Tuzatilgan mantiq

```python
CHEGARA = 5

tugadi = st.session_state.user_message_count >= CHEGARA

if prompt := st.chat_input("Your response",
                           max_chars=1000,
                           disabled=tugadi):        # ⭐ ① kirishni O'CHIRAMIZ
    matn = prompt.strip()
    if not matn:                                    # ⭐ ② "   " tuzog'i
        st.warning("⚠️ Bo'sh javob")
        st.stop()
    if len(matn) > 1000:                            # ⭐ ③ SERVER tekshiruvi
        st.error(f"💥 Juda uzun: {len(matn)}/1000")
        st.stop()

    st.session_state.messages.append({"role": "user", "content": matn})
    with st.chat_message("user"):
        st.markdown(matn)

    # ⭐ ④ HAR xabarga javob — shu jumladan OXIRGISIGA
    with st.chat_message("assistant"):
        stream = client.chat.completions.create(...)
        response = st.write_stream(stream)
    st.session_state.messages.append({"role": "assistant", "content": response})

    st.session_state.user_message_count += 1
    if st.session_state.user_message_count >= CHEGARA:
        st.session_state.chat_complete = True
    st.rerun()                                      # ⭐ ⑤ darhol yangi holat
```

### ✅ Haqiqiy natija — tuzatilgan mantiq

| Xabar soni | Javoblar | Javobsiz | Yutilgan |
|---|---|---|---|
| 3 | 3 | ✅ 0 | 0 |
| ## **5** | ## 🏆 **5** | ## ✅ **0** | 0 |
| ## **6** | ## 🏆 **5** | ## ✅ **0** | 1 *(chegara — to'g'ri)* |
| 8 | 🏆 5 | ✅ 0 | 3 *(chegara)* |

> ## 🏆🏆 **HAR XABARGA JAVOB BOR.** ## Chegaradan keyingi xabarlar — ## `disabled=True` bilan ## ⭐ **umuman yozilmaydi**.

### 🔬 `disabled=True` — o'lchandi

```text
①    ['n=0  disabled=False']  chat_input: 1
  0: ['n=1  disabled=False']  chat_input=1
  1: ['n=2  disabled=False']  chat_input=1
  2: ['n=3  disabled=False']  chat_input=1
  3: ['n=3  disabled=True']   chat_input=1   ← ⭐ n O'ZGARMADI
```

> ## ⭐ **`disabled=True` DA WIDGET KO'RINADI,** ## lekin qiymat **o'tmaydi**.
>
> ## ## 💡 **VA BU — YAXSHI UX:** ## foydalanuvchi maydonni **ko'radi** ## *(g'oyib bo'lgandan yaxshiroq)*, ## lekin **yoza olmaydi**.

---

## 5. ⚠️ Nega umuman **chegara** kerak?

Kurs aytadi:

> *"Hozir ilovamiz xabarlar sonini kuzatmaydi, shuning uchun intervyu cheksiz davom etishi mumkin — yoki hisobimizdagi tokenlar tugaguncha."*

| Chegara | 5 ta savol | ## Chegarasiz, 50 ta savol |
|---|---|---|
| Yuborilgan xabarlar | 30 | ## 💥 **2 550** |
| Tokenlar *(250/xabar)* | 7 500 | ## 💥 **637 500** |
| ## `gpt-4o` narxi | $0.0262 | ## 💥 **$1.6687** |

> ## 💥 **64× QIMMATROQ.** ## Va bu — **bitta** foydalanuvchi.
>
> ## ## 🔑 **KVADRATIK O'SISH — ENG KATTA XAVF:** ## `n` savol = `n(n+1)` xabar.

---

## 🎯 Nazorat savollari

1. Nega `if not st.session_state.messages:` ishlatiladi?
2. Kursning kodida nechta javob va nechta xabar bo'ladi?
3. 6-xabar bilan nima sodir bo'ladi?
4. `disabled=True` da widget yo'qoladimi?
5. 50 ta savollik suhbat 5 tadan necha marta qimmat?

<details>
<summary>Javoblar</summary>

1. Chunki 5-darsda `messages` **eng yuqorida `[]`** qilib boshlangan — kalit **allaqachon mavjud**. ⭐ `not []` → `True`, ya'ni "ro'yxat bo'sh bo'lsa".
2. ## **5 ta xabar, 4 ta javob.** Sabab: kirish sharti `< 5`, javob sharti `< 4`. 💥 **Foydalanuvchining oxirgi javobi javobsiz qoladi** — va hech qanday xato xabari yo'q.
3. ## **Butunlay yutiladi.** O'sha rerunda `chat_input` hali **ko'rinib turadi** *(`chat_complete = True` satri skriptning pastida)*, foydalanuvchi yozadi — 💥 xabar **saqlanmaydi ham, javob ham yo'q**.
4. ## **Yo'q — ko'rinadi, lekin qiymat o'tmaydi.** O'lchandi: `disabled=True` bo'lganda sanagich **o'zgarmadi**. ⭐ Bu — g'oyib bo'lgandan **yaxshiroq UX**.
5. ## **64×** *(30 → 2 550 xabar; $0.0262 → $1.6687)*. 🔑 Sabab — **kvadratik** o'sish: `n` savol = `n(n+1)` xabar.

</details>

---

⬅️ [5-dars](05-Refining-Our-Project.md) · 🏠 [Modul](README.md) · ➡️ [7-dars](07-Feedback-Functionality-Part-2.md)
