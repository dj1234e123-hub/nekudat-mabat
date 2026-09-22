# כללי העריכה והכתיבה בספרדית — "נקודת מבט"

המסמך המעשי. מה עושים בפועל, עם דוגמאות מהאתר.
את **הקול** (למי כותבים, איך זה נשמע, ולמה) ראו ב‑`SPANISH-VOICE.md`.

נכתב 2026-09-22 מתוך סקירה של כל התוכן הספרדי הקיים. כל דוגמה כאן היא
מקרה אמיתי שנמצא ותוקן — לא המחשה.

---

## 0 · סדר העדיפויות

לפי מה שהקוראים בפועל קוראים (90 יום): סיפורים 77% · "מבט לשבת" 8% · רגעים 5%.

1. **סיפור** — עריכה מלאה. זה המוצר בספרדית.
2. **מבט לשבת** — עריכה מלאה.
3. **רגע** — בדיקה מכנית + הפיסוק. עריכה עמוקה רק אם משהו שבור.
4. **ממשק** — נבדק פעם אחת, ואז רק כשמשתנה.

---

## 1 · איזו ספרדית

**ספרדית לטינו‑אמריקאית ניטרלית.** לא ספרד, לא ניב של מדינה אחת.

| נושא | אנחנו | לא אנחנו | למה |
|---|---|---|---|
| פנייה | `tú` | `vos` (ארגנטינה) · `usted` (רחוק) · `vosotros` (ספרד) | `tú` מובן בכל אמריקה הלטינית ואינו ממגדר בפועל |
| רכב | `auto` | `carro` (קריבי/מקסיקני) · `coche` (ספרד) | `auto` הוא ברירת המחדל של ספרדית ניטרלית כתובה |
| דירה | `departamento` | `apartamento` · `piso` | מכסה את מקסיקו+ארגנטינה+צ'ילה+פרו |
| כעס | `enojo` | `enfado` (ספרד) · `cabreo` | |
| מדרכה | `la acera` | `banqueta` (מק') · `vereda` (ארג') | התקן, מובן בכל מקום |
| שיעורי בית | `la tarea` | `los deberes` (ספרד) | |
| בולים | `estampillas` | `sellos` (ספרד) | |
| קופת צדקה | `alcancía` | `hucha` (ספרד) | |
| חניה | `estacionamiento` | `aparcamiento` (ספרד) | |
| ארנק | `la cartera` | `el monedero` | |
| סלון | `la sala` | `el living` (ארג') | |
| כיור | לעקוף בניסוח | `la pileta` (ארג') · `el fregadero` (ספרד) | הניב מפצל; עדיף לנסח אחרת |

**אסור לחלוטין:** `coger` (וולגרי במקסיקו, ארגנטינה וונצואלה) · `vosotros` וכל נטיותיו ·
voseo (`sos`, `tenés`, `querés`) · סלנג מקומי.

**נבדק ואומת:** אין באתר אף מופע של `coger`, voseo או צורות `vosotros`. לשמור על זה.

---

## 2 · פיסוק — כאן נמצאות רוב השגיאות

### 2.1 דיאלוג — מקף ארוך (raya), לא מירכאות

זה **סימן ההיכר מספר אחת** של ספרדית שנכתבה בספרדית.

```
✗ "Seguro te preguntas por qué estoy así," dijo.
✗ "Seguro te preguntas por qué estoy así", dijo.
✓ —Seguro te preguntas por qué estoy así —dijo.
```

**המבנה:** `—` צמוד למילה (בלי רווח). תגית הדיבור אחרי `—` צמוד.
אם המשפט ממשיך אחרי התגית — `—.` וממשיכים.

```
✓ —Un abismo —dijo el guerrero—. Veo una caída.
✓ —Entre nosotros —dijo—, el premio no se da por el resultado.
✓ —No, gracias —sonrió el rabino—. Vine por su hijo.
```

**הפסקה השלמה המקדימה נשארת פסקה:**
```
✓ Elad se sentó a su lado.

  —Ido, vamos a la biblioteca.
```

### 2.2 ציטוט ומחשבה פנימית — גרשיים זוויתיים « »

לא דיאלוג אלא **ציטוט, מחשבה, משפט פנימי, שם יצירה** → `« »`.

```
✓ «Yo soy así».
✓ El rey pensó: «Si un hombre pobre me trae un regalo, cuánto corazón hay en eso.»
✓ su libro «Haamek Sheelá»
```

**אף פעם לא `"` ישר בגוף הטקסט.** (בפרונטמאטר של YAML — כן, שם זה תחביר.)

### 2.3 הנקודה והפסיק יוצאים מחוץ לסוגר

זה הפוך מאנגלית, ולכן זו הטעות הנפוצה ביותר.

```
✗ «Una estafa.»        ✓ «Una estafa».
✗ «Tendría que haber llamado.»   ✓ «Tendría que haber llamado».
```
**יוצא מן הכלל:** `?` ו‑`!` **נשארים בפנים** — הם חלק מהאמירה.
```
✓ «¿Y? ¿Hay novedades?»
```
וגם שלוש הנקודות נשארות בפנים: `«Kol nidré, ve'esaré, ushvué...»`

### 2.4 ¿ ו‑¡ — תמיד, גם באמצע משפט

```
✗ Porque, ¿quién va a sostener todo   ✓ Porque ¿quién va a sostener todo
✗ Ángela, suelta!                     ✓ ¡Suelta, Ángela, suelta!
```
(בטקסט שבור לשורות, הסימן הפותח יכול לשבת בשורה קודמת — זה תקין.)

### 2.5 ⚠ הכלל הקריטי: פסיק בשבירת שורה

**זו הסיבה מספר אחת שהרגעים נשמעו מתורגמים.**

פורמט הרגעים שובר שורה כל 2–5 מילים, ובעברית הפסיק בסוף השורה הוא
**סימן נשימה ולא דקדוק** (כך זה מוגדר ב‑CLAUDE.md). **בספרדית אין דבר כזה.**

ספרדית **אוסרת** פסיק:
- בין נושא לנשוא — `✗ Solo que la lista, ya te resulta conocida.`
- בין פועל למושא/משלים — `✗ Pero esta culpa juzga, a quien eras entonces.`
- לפני `que` משלים — `✗ Cuentas las veces, que perdiste la paciencia.`
- לפני שאלה עקיפה — `✗ Y las piernas ya saben, hacia dónde ir.`

**הכלל: שבירת השורה היא הנשימה. מוחקים את הפסיק,
אלא אם הדקדוק הספרדי רוצה אותו שם בלי קשר לשבירה.**

ספרדית **כן** רוצה פסיק:
- אחרי תיאור מוקדם — `✓ Desde afuera, se ve como una vida llena.`
- לפני פסוקית מחוברת — `✓ Marcó una línea, y la entendiste.`
- משני צדי מאמר מוסגר — `✓ Y la mañana, de algún modo, siempre llegó.`

**המבחן:** מוחקים את שבירות השורה ומרכיבים משפט אחד. אם הפסיק עדיין תקין —
הוא נשאר. אם המשפט נראה שבור — הפסיק היה של העברית.

---

## 3 · דקדוק שנופל שוב ושוב

### 3.1 ספרדית משמיטה כינוי גוף

`Él`, `Ella`, `Yo` בתחילת משפט = תרגומית, אלא אם יש **ניגוד** אמיתי.

```
✗ Ella no rompió dinero. Ella construyó un corazón.
✓ No rompió dinero. Armó un corazón.

✗ Él estaba de pie frente al juez.   (פתיחת טור — אין אפילו למי מתייחס)
✓ Estaba de pie frente al juez.

✓ Él lo sabía. El juez lo sabía.     ← זה כן: ניגוד מפורש
```

**דגש:** נושא **דומם** לעולם לא מקבל כינוי.
`✗ Ella solo muestra que hay algo más adentro.` (על "la ola") → `✓ Solo muestra…`

### 3.2 שם עצם מופשט כנושא דורש תווית

```
✗ Pereza es un nombre.      ✓ La pereza es un nombre.
```
(בעברית אין תווית שם; זו הפרעה ישירה.)

### 3.3 רצף זמנים

אחרי `no sabíamos que` בא **עבר**, לא הווה.
```
✗ Y no sabíamos que toda la estación nos está esperando.
✓ Y toda la estación nos estaba esperando.
```
ואם הסיפור בעבר — הוא נשאר בעבר עד הסוף.
```
✗ Desde entonces, ya no mira igual a los aviones de papel.
✓ Desde entonces, nunca más volvió a mirar igual un avión de papel.
```

### 3.4 מודוס משלים

אחרי `temía que`, `esperaba que`, `quería que` — **subjuntivo**.
```
✗ temía que quedara un resto de rencor que ni yo mismo siento
✓ temía que quedara un resto de rencor que ni yo mismo alcanzara a sentir
```

### 3.5 פועל חסר משלים

עברית מרשה פועל "תלוי"; ספרדית לא.
```
✗ Apareció, antes de que alcanzaras.      ("alcanzar" מה?)
✓ Apareció antes de que pudieras.
```

---

## 4 · לא לתרגם מילים — לתרגם רעיונות

לפני שבוחרים מילה, עונים על ארבע שאלות: **מי אומר · למי · באיזה גיל/יחס · באיזה טון.**

### 4.1 כשלים אמיתיים שנמצאו

| עברית | תרגום שגוי | למה נכשל | הנכון |
|---|---|---|---|
| גימנסיה (בגטו ורשה) | `un gimnasio` | בספרדית זה **חדר כושר** | `una escuela secundaria` |
| לקח נשימה עמוקה | `tomó un respiro` | `tomar un respiro` = לקחת הפסקה | `respiró hondo` |
| הלב צנח | `el corazón se le cayó al piso` | תרגום מילולי; אין ניב כזה | `se le cayó el alma a los pies` |
| סעודה (של הנצי"ב) | `la fiesta` | `fiesta` = מסיבה עם ריקודים | `el banquete` |
| עלה למעלה | `subió hacia arriba` | כפילות | `subió` |
| הרבי (חסידי) | `el rabino` | הופך אותו לרב קהילה | `el Rebe` |
| מתוודים (ווידוי) | `se confiesan` | הווידוי **הקתולי** | `dicen el vidui` |
| שלושה שנות מבחן | `libertad condicional` | = שחרור על תנאי מהכלא; הוא מעולם לא נכנס | `a prueba. Sin cárcel.` |
| שנזכה ל… | `Que merezcamos…` | `merecer` = להיות ראוי; לא זה "לזכות" | `Que sepamos…` / `Ojalá…` |
| והעולם בכלל שם לב | `el mundo por fin se dio cuenta` | `por fin` מוסיף הקלה; המשפט מר | `el mundo siquiera se enteró` |
| פעם לא הצליחה לשכוח | `que ella una vez no pudo olvidar` | `una vez` = calque של "once" | `al que ella no pudo olvidar` |
| להופיע יחד | `presentarse juntos` | = להציג את עצמם | `dar charlas juntos` |

### 4.2 המילים שתמיד נבדקות מחדש

`ילד` — `niño` (עד ~12) · `chico` (נער) · `muchacho` (בחור) · `joven` (צעיר).
**לא מערבבים בתוך סיפור אחד.**
`לב` · `בית` · `דרך` · `אמונה` · `תשובה` · `תפילה` · `שינוי` · `בחירה` · `משמעות`
— לכל אחת מהן יש בספרדית מטען דתי‑תרבותי שונה מהעברי. בודקים בהקשר, לא במילון.

---

## 5 · מונחים יהודיים — מערכת אחת, קבועה

### 5.1 תוארי רב

| בעברית | בספרדית | דוגמה |
|---|---|---|
| רבי X | `Rabí X` | Rabí Israel · Rabí Jizkiá · Rabí Meir Baal Hanés |
| הרב X | `el rabino X` | el rabino Steinman · el rabino Shaj |
| חכם X | `el Jajam X` | el Jajam Efraim HaCohen |
| ר' X | `Reb X` | Reb Azriel David Fastag |
| הרבי (חסידי) | `el Rebe` | el Rebe de Nemirov · el Rebe de Modzitz |
| כינוי מסורתי | כפי שהוא | el Netziv · el Ben Ish Jai |
| רב ללא שם | `un rabino` | |

**`rabino` לעולם לא מחליף `Rebe`** — זה משנה את הסיפור.

### 5.2 שאר המונחים

`Shabat` · `Torá` · `sinagoga` · `tefilín` · `shofar` · `sidur` · `Selijot` · `Elul` ·
`vidui` · `jasid` / `jasidim` · `tzedaká` · `Mashíaj` · `Rosh Hashaná` · `Yom Kipur` ·
`bar mitzvá` · `de bendita memoria` (זצ"ל) · `Mundo Venidero`.

**תעתיק:** `j` לחי"ת/כ"ף (`Jajam`, `jasid`) · `sh` לשי"ן (`Shabat`) · `tz` לצד"י (`tzedaká`).
**שמות פרטיים בעלי צורה ספרדית רגילה נכתבים בה:** `Israel` ולא `Yisrael`.
**שמות לועזיים נשארים כפי שהם:** Mary Johnson, Billy, Theodore, Chaskel Tydor.

### 5.3 מונח שהקהל הזה לא מכיר — חצי משפט, לא הערת שוליים

```
✓ un misnaged —uno de los lituanos que se oponían a los jasidim—
```
זה חל על: `misnaged`, `Litvak`, שמות חצרות חסידיות, שמות ישיבות ליטאיות.
**לא** חל על: `Shabat`, `Torá`, `shofar`, `tefilín`, `Jajam`, `Ben Ish Jai` — הקהל מכיר.

---

## 6 · כותרת, פתיחה, סיפור, סיום

### 6.1 כותרת

- **לא תרגום מילולי של הכותרת העברית.** הכותרת היא הבטחה, והיא נבחרת מחדש בספרדית.
- **חייבת להיות משפט ספרדי תקין.** `✗ Por qué él elegía lejos` → `✓ Por qué estacionaba lejos`.
- **דימוי עברי שלא עובר — מחליפים.** `✗ El puente que asusta a la cabeza`
  → `✓ El puente que la cabeza no se anima a cruzar`.
- **אם הכותרת מבטיחה — הגוף חייב לקיים.** `✗ El chico del avioncito` כשבגוף כתוב
  `avión de papel` → `✓ El chico del avión de papel`.
- **כותרת וסיום הם זוג** (הכלל מ‑MOMENT-FORMAT, חל גם על סיפורים):
  הכותרת `El rey ve el corazón` מול סיום `El rey no miraba el jarrón` — שבור.
  תוקן ל‑`El rey no vio el jarrón. Vio el corazón.`
- **כותרת‑שאלה מסומנת:** `¿Por qué me llamo Efraim?` — עם שני הסימנים.

### 6.2 פתיחה

נפתחים בתוך הסצנה. בלי מסגרת שמסבירה מראש. בלי `Él`/`Ella` שאין להם מקור.
הפתיחה היא גם התצוגה המקדימה בוואטסאפ — **אסור שהיא תענה על שאלת הכותרת.**

### 6.3 גוף הסיפור

- **פסקאות או שורות קצרות — לפי מי מספר** (הכלל העברי, חל כלשונו):
  גוף ראשון, רגע אחד שאני בתוכו → שורות קצרות.
  מישהו אחר, לאורך שנים → פסקאות.
- **דיאלוג ב‑raya.**
- **הדגשה:** `*כך*` בלבד, מעט. ציטוט סיום יחיד ב‑`>`.
- **מספרים:** מפריד אלפים מפצל את הקהל (מקסיקו `4,000`, ארגנטינה `4.000`).
  **כותבים במילים:** `cuatro mil dólares`, `ciento noventa mil dólares`.

### 6.4 סיום

נעצרים על המשפט שנחרט. מוחקים את מה שבא אחריו.
ובנפרד: **בודקים שהסיום מהדהד את הכותרת.**

---

## 7 · ממשק וחוויה

- **שם המותג:** `Punto de Vista`, תמיד. לא `Nekudat Mabat`, לא `Perspectiva`.
- **"רגע של נקודת מבט"** = `Un momento de Punto de Vista`. **ניסוח אחד בלבד** בכל האתר.
- **כפתורים בגוף ראשון** (`Unirme al grupo`), **תוויות בציווי** (`Copia el enlace:`),
  **פעולות בשם הפועל** (`Copiar enlace`).
- **אין הזמנה לשיחה אישית בספרדית** — אפרים אינו מלווה בספרדית (החלטה קיימת).
- **קבוצת הוואטסאפ הספרדית בלבד** בעמודים ספרדיים. אפס ערבוב.
- **לא ממגדרים בממשק.** `Te doy la bienvenida`, לא `Bienvenido`.

---

## 8 · תהליך

1. בעל הפרויקט מאשר את הטקסט **העברי** ומפרסם.
2. התרגום נכתב **מהמשמעות**, לא מהמבנה. קוראים את כל הסיפור לפני שכותבים שורה.
3. מריצים את הצ'ק‑ליסט למטה.
4. בנייה מלאה + בדפדפן ב‑390px וב‑1280px.
5. **"מבחר ולא מראה"** — תוכן עברי חדש אינו יוצר חוב תרגום.
   אבל מה שכן תורגם חייב לשקף את הנוסח העברי **העדכני**.
6. תרגומים לא עברו בדיקת דוברת ספרדית ילידית (החלטת ההשקה 2026-08-30).
   **זה עדיין הפער הפתוח הגדול ביותר.** המסמכים האלה מצמצמים אותו; הם לא סוגרים אותו.

---

## Spanish Pre‑Publish Checklist

לפני שתוכן ספרדי עולה לאתר — כל השורות מסומנות.

### פיסוק וטיפוגרפיה
- [ ] כל דיאלוג ב‑`—`, לא במירכאות.
- [ ] אפס `"` ישר בגוף הטקסט. ציטוט ומחשבה ב‑`« »`.
- [ ] נקודה ופסיק **מחוץ** ל‑`»`. `?`/`!`/`...` **בפנים**.
- [ ] כל `?` יש לו `¿`. כל `!` יש לו `¡`.
- [ ] **אין פסיק בשבירת שורה** אלא אם הדקדוק הספרדי דורש אותו בלי קשר לשבירה.
- [ ] מספרים גדולים במילים, לא בספרות עם מפריד.

### דקדוק
- [ ] אין `Él`/`Ella`/`Yo` בתחילת משפט בלי ניגוד אמיתי. אין כינוי לנושא דומם.
- [ ] שם עצם מופשט כנושא מקבל תווית (`La pereza…`).
- [ ] רצף הזמנים עקבי לאורך כל הטקסט.
- [ ] subjuntivo אחרי `temía que` / `esperaba que` / `quería que`.
- [ ] אין פועל בלי משלים.

### ניב וקהל
- [ ] `tú`. אפס voseo, אפס `vosotros`, אפס `usted`.
- [ ] אפס `coger`. אפס מילים מספרד (טבלה §1). אפס סלנג מקומי.
- [ ] `auto` · `departamento` · `enojo` · `la tarea` · `estampillas` · `la sala`.
- [ ] אפס שם תואר שממגדר את הקורא.

### תרבות ומונחים
- [ ] אפס מילה קתולית: `confesarse`, `pecado`, `templo`, `redención`.
- [ ] תוארי רב לפי הטבלה (§5.1). `Rebe` ולא `rabino` בסיפור חסידי.
- [ ] תעתיק לפי §5.2. שם עם צורה ספרדית רגילה — בצורה הספרדית.
- [ ] מונח אשכנזי‑חסידי קיבל חצי משפט של הקשר.

### תוכן וקול
- [ ] הכותרת היא משפט ספרדי תקין, ומילת הכותרת מופיעה בגוף.
- [ ] הכותרת והסיום הם זוג.
- [ ] התקציר אינו עונה על שאלת הכותרת ואינו חושף את הסוף.
- [ ] אין משפט הסבר אחרי הסיום.
- [ ] `Punto de Vista` — לא `Perspectiva`, לא תעתיק.
- [ ] אין הזמנה לשיחה אישית; קבוצת וואטסאפ ספרדית בלבד.

### מבחן הדובר הילידי
- [ ] קראתי את הטקסט **בלי להסתכל בעברית**, מההתחלה עד הסוף.
- [ ] לא עצרתי באף מקום לשאול "מה ניסו להגיד כאן?"
- [ ] לא הצלחתי לזהות את מבנה המשפט העברי מתחת.

### טכני
- [ ] `npm run build` — 0 שגיאות.
- [ ] `npm run check:moments` — 0 FAIL (אם נגעו ברגעים).
- [ ] דפדפן ב‑390px וב‑1280px: אפס גלישה אופקית, אפס שגיאות JS.
- [ ] hreflang ותמונת שיתוף עובדים על התאום.

---

## §9 — כתובות ספרדיות

הכתובת הציבורית נגזרת מהכותרת הספרדית, לא משם הקובץ העברי. המיפוי חי
ב-`src/data/es-slugs.ts`, וסיפור ספרדי בלי שורה שם מכשיל את הבנייה.

**כללי כתיבה:**

| כלל | דוגמה |
|---|---|
| ASCII בלבד, אותיות קטנות, מקפים | `El pañuelo dorado` → `el-panuelo-dorado` |
| מותר לקצר כותרת ארוכה — זו כתובת, לא תרגום | `El puente que la cabeza no se anima a cruzar` → `el-puente-que-la-cabeza-no-cruza` |
| **מילה שנשברת ב-ASCII — לעקוף בניסוח, לא בתעתיק עקום** | `Cien años` → **לא** `cien-anos` (מילה גסה) ולא `anios` (נראה שגיאת כתיב) → `un-siglo-de-retraso` |
| מונח שכבר חי בספרדית של האתר — לא מתרגמים | `tzadikim` (התווית עצמה: "Historias de tzadikim") |
| שם פרטי — לא מתרגמים | שם פרשה: `/es/shabat/nitzavim/` |

**כתובת ששותפה פעם — לא מתה.** כל שינוי סלאג גורר הפניה קבועה (308).
ההפניות נוצרות מאותה מפה: `npm run sync:es-redirects`, ונבדקות ב-
`npm run check:es-redirects`. אי אפשר לייצר אותן בזמן build — `vercel.json`
נקרא ע"י Vercel לפני שהבנייה מתחילה.

**בדיקה לפני פרסום:** האם הסלאג קריא לדובר ספרדית שלא ראה את העברית?
האם הוא מכיל את מילות המפתח של הכותרת? האם אין בו מילה שנשברה בלי הטעמה?
