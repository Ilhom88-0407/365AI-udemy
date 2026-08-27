# 📝 68-modul. Mashqlar

> **12 ta mashq.** 🟢 oson · 🟡 o'rta · 🔴 qiyin
> Hammasi **kodli va bajarilgan** — etika ham o'lchanadi.

---

## 🟢 1-mashq. Etik risk registri

<details><summary>Yechim</summary>

```python
from dataclasses import dataclass


@dataclass
class EtikRisk:
    bosqich: str
    tavsif: str
    ehtimol: int          # 1-5
    ta_sir: int           # 1-5
    prinsip: str
    chora: str = ""

    @property
    def ball(self):
        return self.ehtimol * self.ta_sir

    @property
    def daraja(self):
        b = self.ball
        return ("KRITIK" if b >= 16 else "YUQORI" if b >= 9 else
                "O'RTA" if b >= 4 else "PAST")
```

```
  KRITIK  25  [monitoring    ] adolat       Ball haqiqiy sifatni aks ettirmaydi
  KRITIK  20  [to'plash      ] maxfiylik    Nomzod javoblari saqlanadi
  KRITIK  20  [joylashtirish ] javobgarlik  Prompt injection
  KRITIK  16  [ishlab chiqish] adolat       Model o'zbekchani yomon biladi
  YUQORI  15  [to'plash      ] adolat       Ism promptga tushadi
  YUQORI  10  [joylashtirish ] shaffoflik   Zaxira ishlagani aytilmaydi
```

> ## 💥 **TO'RTTA RISK — KRITIK.** ## ⭐ Va eng yuqorisi *(25)* — ## 67-modulda **o'lchagan** muammo.
</details>

---

## 🟢 2-mashq. Hayot sikli auditi

<details><summary>Yechim</summary>

```
XULOSA: ✅ 3   💥 9   ⚠️ 4   (jami 16)
tayyorlik: 18.8%
```

> ## 💥 **18.8%** — va bu, 67-modulda *"ishonchli"* deb atagan ilova.
</details>

---

## 🟡 3-mashq. Rozilik siyosati auditi

<details><summary>Yechim</summary>

```python
TALAB = ["saqlash_muddati", "maqsad", "taqiqlangan", "o'chirish_huquqi",
         "yangi_maqsad_uchun", "uchinchi_tomonlar", "bolalar_uchun"]


def rozilik_audit(siyosat):
    yetishmaydi = [t for t in TALAB if t not in siyosat]
    ball = (len(TALAB) - len(yetishmaydi)) / len(TALAB) * 100
    return ball, yetishmaydi
```

```
to'liqlik: 71%
yetishmaydi: ['uchinchi_tomonlar', 'bolalar_uchun']
```
</details>

---

## 🟡 4-mashq. ⚖️ Regulyatsiya bo'shlig'i

<details><summary>Yechim</summary>

```
  texnologiya                 paydo  hujjat                             bo'shliq
  ------------------------------------------------------------------------------
  Yuz tanish                   2014  EU AI Act (yuqori xavf)             10 yil
  Ijtimoiy tarmoq ma'lumoti    2007  GDPR                                11 yil
  Ovoz klonlash                2019  — (aniq qonun yo'q)              HALI YO'Q
  Generativ matn (LLM)         2022  EU AI Act (GPAI qoidalari)           2 yil
  Deepfake video               2018  — (qisman)                       HALI YO'Q
  Avtomatik yollash            2016  NYC Local Law 144                    7 yil

  o'rtacha bo'shliq: 7.5 yil
  hali qonunsiz    : 2/6
```

> ## 💥 **O'RTACHA 7.5 YIL.** ## ⚠️ Raqamlar taxminiy, lekin **tartib** aniq.
</details>

---

## 🟡 5-mashq. Qaysi ramka?

<details><summary>Yechim</summary>

```python
def qaysi_ramka(vaziyat):
    if vaziyat.get("qonun_bor"):
        return "⚖️ QONUN — majburiy, minimal daraja"
    if vaziyat.get("sanoat_standarti"):
        return "📋 STANDART — kasb hamjamiyati"
    return "🧭 ETIKA — o'zingiz qaror qilasiz"
```

```
EU da yollash AI si            -> ⚖️ QONUN
Tibbiy AI, AQSh                -> ⚖️ QONUN
Intervyu boti, O'zbekiston     -> 🧭 ETIKA
Ovoz klonlash                  -> 📋 STANDART
```

> ## ⚠️ **"QONUN YO'Q" ≠ "HAMMA NARSA MUMKIN".** ## Bu — **javobgarlik butunlay sizda** degani.
</details>

---

## 🟡 6-mashq. 🔬 Model kartasi to'liqmi?

<details><summary>Yechim</summary>

```python
MODEL_KARTA_TALABLARI = [
    "model_nomi", "versiya", "maqsad", "cheklovlar",
    "o'quv_malumoti", "baholash_metrikalari", "guruhlar_boyicha_natija",
    "ma'lum_xatolar", "aloqa", "yangilangan_sana",
]


def karta_audit(karta):
    yo_q = [t for t in MODEL_KARTA_TALABLARI if not karta.get(t)]
    return (len(MODEL_KARTA_TALABLARI) - len(yo_q)) / len(MODEL_KARTA_TALABLARI) * 100, yo_q
```

```python
BIZNING = {
    "model_nomi": "Qwen2.5-0.5B-Instruct",
    "versiya": "1.0",
    "maqsad": "HR intervyu simulyatori",
    "cheklovlar": "o'zbek tilida sifat past",
    "ma'lum_xatolar": "ball 8..9 diapazonida",
}
```

```
to'liqlik: 50%
yetishmaydi: ["o'quv_malumoti", 'baholash_metrikalari',
              'guruhlar_boyicha_natija', 'aloqa', 'yangilangan_sana']
```

> ## 💥 **50%** — va yetishmayotgan beshtaning ## uchtasi **auditga bevosita kerak**.
</details>

---

## 🔴 7-mashq. 🧭 Qaror daraxti — *"bu loyihani qilamizmi?"*

<details><summary>Yechim</summary>

```python
def loyiha_qaroriy(t):
    """Etik STOP-signallari. Bittasi ham bo'lsa — to'xtaymiz."""
    stop = []
    if t.get("rozilik") is False:
        stop.append("💥 rozilik yo'q")
    if t.get("himoyalangan_belgi") and not t.get("bias_auditi"):
        stop.append("💥 himoyalangan belgi + audit yo'q")
    if t.get("qaytarib_bolmaydigan_qaror") and not t.get("inson_nazorati"):
        stop.append("💥 qaytarib bo'lmaydigan qaror + inson nazorati yo'q")
    if t.get("bolalar") and not t.get("yosh_tekshiruvi"):
        stop.append("💥 bolalar + yosh tekshiruvi yo'q")
    return (("🛑 TO'XTATING", stop) if stop else ("✅ DAVOM ETING", []))
```

```
intervyu boti (bizniki)     -> 🛑 TO'XTATING  ['💥 himoyalangan belgi + audit yo\'q']
tibbiy tashxis              -> 🛑 TO'XTATING  ['💥 qaytarib bo\'lmaydigan qaror + inson nazorati yo\'q']
kod avtomatik to'ldirish    -> ✅ DAVOM ETING []
bolalar uchun o'yin         -> 🛑 TO'XTATING  ['💥 bolalar + yosh tekshiruvi yo\'q']
```

> ## 💥 **BIZNING ILOVAMIZ HAM `TO'XTATING` OLDI** — ## ism promptga tushadi, bias auditi esa **yo'q**.
>
> ## ## 🏆 **69-MODULDA AUDITNI QILAMIZ.**
</details>

---

## 🟡 8-mashq. 📅 Model eskirish sanasi

<details><summary>Yechim</summary>

```python
def qayta_korish(yaratilgan_yil, soha_tezligi="tez"):
    OYLAR = {"tez": 6, "o'rta": 12, "sekin": 24}
    return OYLAR[soha_tezligi]
```

```
soha            qayta ko'rish     sabab
------------------------------------------------------------
LLM/AI            6 oy            modellar tez o'zgaradi
IT intervyu       6 oy            texnologiyalar yangilanadi
Buxgalteriya     12 oy            qonunlar yiliga o'zgaradi
Tarix/til        24 oy            sekin o'zgaradi
```

> ## ⭐ **BIZNING MB — IT INTERVYU: 6 OY.** ## 💥 Ya'ni yiliga **ikki marta** qayta ko'rib chiqish kerak.
</details>

---

## 🟡 9-mashq. 🔬 Kim javobgar? — javobgarlik matritsasi

<details><summary>Yechim</summary>

```
hodisa                              ishlab chiquvchi  operator  foydalanuvchi
-------------------------------------------------------------------------------
Model gallyutsinatsiya qildi              ●              ○            
Prompt injection o'tdi                    ●              ●            
Foydalanuvchi yolg'on ma'lumot berdi                                  ●
MB dagi savol eskirgan                                   ●            
Ball noto'g'ri (validlik yo'q)            ●              ●            
Kalit GitHub ga yuklandi                                 ●            
```

> ## 🔑 **IKKITA QATORDA IKKALASI HAM `●`** — ## bu **eng xavfli holat**: ## 💥 *"boshqasi qiladi"* deb ## **hech kim qilmaydi**.
>
> ## ## 🏆 **YECHIM:** har qator uchun ## ⭐ **BITTA javobgar** belgilang.
</details>

---

## 🔴 10-mashq. 💥 Etik dilemma — kod bilan

<details><summary>Yechim</summary>

```python
def teng_muomala(nomzodlar, savollar):
    """A: hammaga bir xil savollar."""
    return {n["ism"]: savollar for n in nomzodlar}


def teng_imkoniyat(nomzodlar, savollar_bazasi):
    """B: har kimga darajasiga mos savollar."""
    return {n["ism"]: savollar_bazasi[n["daraja"]] for n in nomzodlar}
```

```
A teng muomala:
  Aziz    (Junior) -> ['Umumiy 1', 'Umumiy 2']
  Bekzod  (Senior) -> ['Umumiy 1', 'Umumiy 2']

B teng imkoniyat:
  Aziz    (Junior) -> ['Junior 1', 'Junior 2']
  Bekzod  (Senior) -> ['Senior 1', 'Senior 2']

taqqoslash mumkinmi:  A: ✅   B: 💥
har kim o'z darajasida: A: 💥   B: ✅
```

> ## 🔑 **NOTO'G'RI JAVOB YO'Q — TURLI QADRIYATLAR BOR.** ## ⚠️ Muhimi — bu **ongli qaror** bo'lsin.
</details>

---

## 🔴 11-mashq. 📋 Etik e'lon generatori

Foydalanuvchiga **nima aytish** kerak?

<details><summary>Yechim</summary>

```python
def etik_elon(tizim):
    q = ["🤖 Bu — sun'iy intellekt tizimi."]
    if tizim.get("zaxira_ishlatiladi"):
        q.append("⚠️ Ba'zi savollar oldindan tayyorlangan bazadan olinadi.")
    if tizim.get("baho_beradi"):
        q.append("📊 Baho — taxminiy va yakuniy qaror emas.")
    if tizim.get("saqlanadi"):
        q.append(f"💾 Javoblaringiz {tizim['saqlash_muddati']} saqlanadi.")
    if tizim.get("shikoyat"):
        q.append("📮 Natija bilan rozi bo'lmasangiz: " + tizim["shikoyat"])
    else:
        q.append("💥 [SHIKOYAT KANALI YO'Q — QO'SHISH KERAK]")
    return "\n".join(q)
```

```
🤖 Bu — sun'iy intellekt tizimi.
⚠️ Ba'zi savollar oldindan tayyorlangan bazadan olinadi.
📊 Baho — taxminiy va yakuniy qaror emas.
💾 Javoblaringiz 30 kun saqlanadi.
💥 [SHIKOYAT KANALI YO'Q — QO'SHISH KERAK]
```

> ## 🏆 **GENERATOR O'ZI YETISHMAYOTGAN NARSANI AYTADI.** ## ⭐ Bu — **hujjat emas, tekshiruv**.
</details>

---

## 🔴 12-mashq. 🏆 To'liq etik hisobot

<details><summary>Yechim</summary>

```
════════════════════════════════════════════════════
  ETIK HISOBOT: Ace Interview
════════════════════════════════════════════════════
  risklar         : 6 ta (4 KRITIK, 2 YUQORI)
  hayot sikli     : 3/16 (18.8%)
  rozilik siyosati: 71%
  model kartasi   : 50%
  e'lon           : 4/5 band (80%)
  ------------------------------------------------
  UMUMIY ETIK TAYYORLIK: 54.9%
  💥 ISHLAB CHIQARISHGA TAYYOR EMAS
════════════════════════════════════════════════════
```

> ## 💥💥 **54.9%** — to'rtta o'lchovning o'rtachasi.
>
> ## ## ⚠️ **VA E'TIBOR BERING — ENG PAST BALL `18.8%`,** ## eng yuqori `80%`. ## ⭐ O'rtacha **haqiqiy holatni yashiradi**.
>
> ## ## 🔑 **VA BU — HALOL RAQAM:** ## ilova **texnik jihatdan ishlaydi**, ## lekin **etik jihatdan tayyor emas**.

> ## 🏆 **KEYINGI SAKKIZTA MODUL — SHU RAQAMNI OSHIRISH HAQIDA.**
</details>

---

🏠 [Modul](README.md) · ⬅️ [4-dars](04-Ethics-vs-Laws.md)
