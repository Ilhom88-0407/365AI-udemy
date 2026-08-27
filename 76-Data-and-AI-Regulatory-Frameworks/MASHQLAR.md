# 📝 76-modul. Mashqlar

> **7 ta mashq.** 🟢 oson · 🟡 o'rta · 🔴 qiyin
> Hammasi **kodli va bajarilgan** — quyidagi natijalar **haqiqiy chiqish**.

---

## 🟢 1-mashq. Rozilik kuchaytirish koeffitsienti

Do'stlar sonini o'zgartiring. `270 000` odamning roziligi nechta
odamga ta'sir qiladi?

<details><summary>Yechim</summary>

```
   do'stlar soni   kuchaytirish       270k dan
              50            50x     13,500,000
             150           150x     40,500,000
             320           320x     86,400,000
             500           500x    135,000,000
            1000          1000x    270,000,000
```

> ## 💥💥💥 **ENG KICHIK TAXMINDA HAM — ## 13.5 MLN ODAM.**

> ## 🔑 **VA XULOSA TAXMINGA BOG'LIQ EMAS:** ## har holatda ## ⭐ **millionlab odam**.

> ## 🏆 **AMALIY MA'NOSI:** ## *"faqat men rozilik berdim"* degan narsa ## 💥 **YO'Q**. ## ## 💡 Ijtimoiy grafda rozilik ## ⭐ **hech qachon shaxsiy emas**.
</details>

---

## 🟡 2-mashq. Yangi tizimlarni tasniflang

<details><summary>Yechim</summary>

```
  Talaba inshosini baholovchi AI     -> YUQORI XAVF
  Restoran tavsiyasi                 -> SHAFFOFLIK
  Tibbiy rentgen tahlili             -> YUQORI XAVF
  Ombor robotini boshqarish          -> MINIMAL
  Sud qarorini bashorat qilish       -> YUQORI XAVF
  Emotsiyani aniqlash (ish joyi)     -> TAQIQLANGAN
  Musiqa generatori                  -> SHAFFOFLIK
```

> ## 💥 **"TALABA INSHOSINI BAHOLASH" — YUQORI XAVF.**
>
> ## ## ⚠️ Ko'p o'qituvchi buni ## ⭐ **oddiy vosita** deb o'ylaydi.

> ## 🔑 **"OMBOR ROBOTI" — MINIMAL,** ## garchi u ## ⭐ **jismonan xavfli** bo'lsa ham.

> ## 💡 **SABAB:** ## AI Act ## 🏆 **HUQUQLARGA** ta'sirni o'lchaydi, ## ⚠️ **jismoniy xavfni emas** — ## u boshqa qonunlar bilan qoplanadi.
</details>

---

## 🔴 3-mashq. GDPR — qaysi talab eng qimmat?

<details><summary>Yechim</summary>

```
  talab                           murakkablik  izoh
  o'chirish huquqi                          8  baza oson, MODEL deyarli imkonsiz
  tuzatish huquqi                           5  baza + MODEL qayta o'qitish
  ma'lumot minimallashtirish                4  sxemani qayta ko'rish
  kirish huquqi                             3  eksport funksiyasi
  buzilish haqida xabar                     3  monitoring + jarayon
  aniq rozilik olish                        2  UI + baza
  saqlash muddatini cheklash                2  cron + baza
  maqsadni cheklash                         1  hujjat

  jami murakkablik: 28
  eng qimmat 2 tasi: 13 (46%)
```

> ## 💥💥 **IKKITA TALAB — BUTUN ISHNING 46% I.**
>
> ## ## 🔑 Va ikkalasi ham ## ⭐ **MODELGA** tegishli, bazaga emas.

> ## 🏆 **VA SHUNING UCHUN 70-MODULDAGI ## QOIDA ENG QIMMATLISI:**
>
> ## ## 💡 **ma'lumotni YIG'MASLIK — ## keyin o'chirishdan arzonroq.**

> ## ⚠️ **RAQAMLAR — MENING BAHOM,** ## o'lchov emas. ## ## ⭐ Lekin **tartib** aniq: ## 💥 modelga tegadigan talablar **eng qimmat**.
</details>

---

## 🟡 4-mashq. Qaysi talab **hamma joyda** uchraydi?

<details><summary>Yechim</summary>

```
  talab                         nechta shtatda
  kirish                                     3
  opt_out                                    3
  o'chirish                                  2
  shaffoflik                                 1
  nomzodga xabar                             1
  bias auditi                                1
  audit e'loni                               1
  biometrik saqlash muddati                  1
  biometrik rozilik                          1
  ta'sir baholovi                            1

  1 shtatda: 7 ta talab
  2+ shtatda: 3 ta talab
```

> ## 🏆 **UCHTA TALAB — YADRO:** ## `kirish`, `opt_out`, `o'chirish`.

> ## 💡 **BULARNI BIRINCHI QILING** — ## ular ## ⭐ **eng ko'p shtatni** qoplaydi.

> ## ⚠️ **VA 7 TASI FAQAT BITTA SHTATDA.** ## ## 💥 Ya'ni *"yamoq"* ning ko'p qismi — ## 🔑 **noyob, mahalliy talablar**, ## va ular ## ⭐ **birlashtirilmaydi**.
</details>

---

## 🟡 5-mashq. Qaysi yurisdiksiyadan boshlash kerak?

<details><summary>Yechim</summary>

```
  Jami noyob talab: 10

   boshlansa   qoplandi   qolgan
          EU          6        4
          CN          4        6
          ZA          3        7
          NY          2        8

  Eng samarali boshlash: EU (6/10 = 60%)
```

> ## ✅ **EU — ENG SAMARALI BOSHLANISH,** ## lekin ## 💥 **atigi 60%**.

> ## 🔑 **QOLGAN 4 TASI:** ## `ma'lumot tasnifi` va ## `chegaradan o'tkazish ruxsati` *(Xitoy)*, ## `nomzodga xabar` *(NY)*, `kirish` *(POPIA)*.

> ## 💡 **VA IKKINCHI QADAM — XITOY,** ## chunki uning ikkita talabi ## ⭐ **arxitekturaga** tegadi ## *(serverni ko'chirish)*, ## va ## 💥 **keyin tuzatish eng qimmat**.
</details>

---

## 🟢 6-mashq. O'z bazangizning token narxi

<details><summary>Yechim</summary>

```
  50,000 ta ism, kiritma narxi $2.50/1M token:
  mintaqa                 token    narx $
  AQSh/Britaniya        100,000      0.25
  O'zbekiston           275,000      0.69
  Nigeriya              325,000      0.81
```

> ## ⚠️ **FARQ — `$0.56`. ## BU HECH NARSA EMAS.**

> ## 🔑 **VA BUNI HALOL AYTISH KERAK:** ## bitta so'rovda til jarimasi ## ⭐ **pul jihatidan ahamiyatsiz**.

> ## 🏆 **MUAMMO — PULDA EMAS:**
>
> ## | Nima | Ta'siri | ## |---|---| ## | Narx | ## ✅ **Ahamiyatsiz** | ## | ## **Kontekst oynasi** | ## 💥 **3x kam nomzod sig'adi** | ## | ## **Model sifati** | ## 💥 **Bu ismlarni kamroq ko'rgan** |

> ## 💡 **74-MODULDA HAM SHUNDAY EDI:** ## qisqa savolda jarima ## ⭐ **`+$1.09`/yil**, ## RAG da esa ## 💥 **`+$47`**.
</details>

---

## 🔴 7-mashq. Muvofiqlik yo'l xaritasi

<details><summary>Yechim</summary>

```
  qadam                                         kun  bog'liqlik
  Foydalanuvchi mamlakatlarini ro'yxatga olish    1  hech narsa
  Talablar birlashmasini hisoblash                1  1-qadam
  AI Act toifasini aniqlash                       1  hech narsa
  Ma'lumot tasnifi (DSL)                          2  70-modul pasporti
  Bias auditi + sezgirlik nazorati                5  69-71-modul
  Model karta yozish                              2  72-modul
  Inson nazorati jarayoni                         5  73-modul
  Qaytarish yo'li                                 3  73-modul
  Saqlash muddati + o'chirish                     5  70-modul
  CI/CD chegaralari                               3  72-modul

  jami: 28 kun
  2 kundan kam: 5/10 qadam (7 kun)
```

> ## 🏆🏆 **10 TA QADAMDAN 5 TASI — ## ⭐ 7 KUN ICHIDA BAJARILADI.**

> ## 💡 **VA ULAR "MUVOFIQ EMASMIZ" DAN ## ⭐ "NIMA YETISHMAYOTGANINI BILAMIZ" GA ## O'TKAZADI.**

> ## 🔑 **BIRINCHI UCHTASI — ## HECH QANDAY BOG'LIQLIKSIZ,** ## va ular ## 🏆 **butun rejani belgilaydi**.

> ## ⚠️ **"28 kun" — MENING BAHOM,** ## jamoa va tizimga qarab ## 💥 **keskin farq qiladi**. ## ## ⭐ Muhimi — **tartib**, aniq son emas.
</details>

---

## 🏁 Yakuniy jadval

| # | Mashq | Asosiy natija |
|---|---|---|
| 1 | ## **Rozilik kuchayishi** | ## 💥 **Eng kichik taxminda ham 13.5 mln** |
| 2 | AI Act tasnifi | 💥 Insho baholash — **yuqori xavf** |
| 3 | ## **GDPR murakkabligi** | ## 💥 **2 ta talab = 46%** |
| 4 | Shtat talablari | ⭐ 3 ta yadro, **7 tasi noyob** |
| 5 | ## **Qayerdan boshlash** | ## ⚠️ **EU — atigi 60%** |
| 6 | ## **Ism narxi** | ## ⚠️ **`$0.56` — ahamiyatsiz** |
| 7 | ## **Yo'l xaritasi** | ## 🏆 **5/10 qadam — 7 kun** |

---

⬅️ [5-dars](05-Africa.md) · 🏠 [Modul](README.md)
