// תמונת הציטוט של "מבט לשבת" — נוצרת בזמן הבנייה, מהציטוט שבפרונטמאטר.
//
// המפרט המלא: .claude/skills/mabat-quote-image/SKILL.md. מה שמומש כאן:
// רקע שמנת, נקודת זהב אחת למעלה, הציטוט בכחול עמוק ב-Frank Ruhl Libre,
// וכתובת האתר בתחתית. בלי חתימה, בלי לוגו, בלי שם הפרשה — הציטוט הוא המרכז.
//
// 1080x1350 (יחס 4:5), כמו כרטיסי הרגעים: היחס שנכנס לסטטוס וואטסאפ בלי חיתוך.
//
// למה resvg ולא כלי עיצוב: זה אותו צינור שכבר מייצר 218 כרטיסי רגעים עם
// bidi מלא דרך rustybuzz, ועם קובצי הפונט הייעודיים של הפרויקט. שלושת
// הגיליונות הראשונים נבנו ידנית ב-Chromium — מסלול חד-פעמי שתועד מראש
// כזמני (שלב 4.36), והצינור הזה מחליף אותו.
import { Resvg } from '@resvg/resvg-js';
import { FONT_FILES, REGULAR, BOLD, measure, escape, RLO, PDF } from './og-fonts';

export const WIDTH = 1080;
export const HEIGHT = 1350;
const CENTER = WIDTH / 2;
const MARGIN = 100;
const MAX_TEXT_WIDTH = WIDTH - MARGIN * 2;

/**
 * התחום שבו הציטוט חי. מרכזו (680) נקבע לפי שני הגיליונות שנבנו ידנית —
 * גוש הטקסט שם יושב מעט מעל אמצע הכרטיס, לא בדיוק עליו.
 */
const TEXT_TOP = 230;
const TEXT_BOTTOM = 1130;

const DOT_Y = 150;
const DOT_R = 8.5;
const URL_Y = 1304;

const PAPER = '#f3e9d3';
const MUTED = '#75695a';
const GOLD = '#c9a24d';
const BLUE = '#003b5c';
/**
 * זהב המותג על שמנת נמדד 2.24 מול תקן של 4.5, ולכן מילה מודגשת מקבלת גוון
 * כהה יותר. נקודת הזהב שבראש נשארת בזהב האמיתי — נקודה אינה טקסט.
 */
const GOLD_INK = '#8f6f28';

/**
 * הקרשנדו. שורת הנחיתה (האחרונה) היא 1.0, ושורות ההכנה מטפסות אליה.
 *
 * הלקח מהאזינו (2026-09-17): שתי שורות באותו גודל מבטלות זו את זו — שתיהן
 * צועקות ואף אחת לא נוחתת. היחסים כאן שוחזרו משני הגיליונות שנבנו ידנית:
 * יום כיפור 66/80/104 יוצא 0.64/0.78/1.0, והאזינו 74/110 קרוב ל-0.64/1.0.
 */
const SETUP_MIN = 0.64;
const SETUP_MAX = 0.78;

const LINE_RATIO = 1.55;
const BASELINE_RATIO = 0.78;

/** תקרה ורצפה לגודל שורת הנחיתה. הגודל נבחר אוטומטית — הגדול ביותר שנכנס. */
const MAX_SIZE = 116;
const MIN_SIZE = 54;

/** היחס של שורה i מתוך n לגודל שורת הנחיתה */
function ratio(i: number, n: number): number {
  if (i === n - 1) return 1;
  if (n <= 2) return SETUP_MIN;
  return SETUP_MIN + (SETUP_MAX - SETUP_MIN) * (i / (n - 2));
}

/** הטקסט בלי סימני ההדגשה — למדידה ולהשוואה מול גוף הטור */
export const stripMarks = (line: string) => line.replace(/\*\*/g, '');

/** פריסה אנכית של הציטוט בגודל נתון */
function compose(lines: string[], size: number) {
  const items = lines.map((text, i) => {
    const fontSize = size * ratio(i, lines.length);
    const h = fontSize * LINE_RATIO;
    return {
      text,
      fontSize,
      h,
      baseline: h * BASELINE_RATIO,
      // שורת הנחיתה בגופן הכבד; שורות ההכנה רגילות.
      family: i === lines.length - 1 ? BOLD : REGULAR,
    };
  });
  const height = items.reduce((sum, item) => sum + item.h, 0);
  const widest = Math.max(
    ...items.map((item) => measure(stripMarks(item.text), item.fontSize, item.family))
  );
  return { items, height, widest };
}

/** הגודל הגדול ביותר שבו הציטוט נכנס — ברוחב ובגובה כאחד */
function fit(lines: string[]) {
  const available = TEXT_BOTTOM - TEXT_TOP;
  for (let size = MAX_SIZE; size >= MIN_SIZE; size -= 1) {
    const candidate = compose(lines, size);
    if (candidate.height <= available && candidate.widest <= MAX_TEXT_WIDTH) return candidate;
  }
  return compose(lines, MIN_SIZE);
}

/**
 * שורה אחת → תוכן של <text>. `**מילה**` נצבעת בזהב הכהה ושומרת על משקל
 * השורה — הדגשה כאן היא צבע בלבד, לא משקל (בשורת הנחיתה הכול כבר כבד).
 * עטיפת ה-RLO היא לשורה עברית בלבד; בלטינית היא הייתה הופכת את הטקסט.
 */
function inline(line: string, rtl: boolean): string {
  const body = line
    .split(/(\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('**') && part.endsWith('**')
        ? `<tspan fill="${GOLD_INK}">${escape(part.slice(2, -2))}</tspan>`
        : escape(part)
    )
    .join('');
  return rtl ? `${RLO}${body}${PDF}` : body;
}

export function renderQuoteCard(
  lines: string[],
  siteHost: string,
  lang: 'he' | 'es' = 'he'
): Buffer {
  const { items, height } = fit(lines);
  const rtl = lang !== 'es';
  const direction = rtl ? 'rtl' : 'ltr';
  // הכתובת בספרדית מצביעה על שער האזור — מי שיקליד את הדומיין לבדו ינחת בעברית.
  const urlText = rtl ? siteHost : `${siteHost}/es`;

  // מרכוז אנכי בתוך התחום. Math.max שומר על הקצה העליון: ציטוט ארוך מהרגיל
  // יגלוש למטה ולא ידרוס את נקודת הזהב.
  let cursor = Math.max(TEXT_TOP, TEXT_TOP + (TEXT_BOTTOM - TEXT_TOP - height) / 2);
  const svg: string[] = [];

  for (const item of items) {
    const y = (cursor + item.baseline).toFixed(1);
    svg.push(
      `<text x="${CENTER}" y="${y}" font-family="${item.family}" font-size="${item.fontSize.toFixed(1)}" fill="${BLUE}" direction="${direction}" text-anchor="middle">${inline(item.text, rtl)}</text>`
    );
    cursor += item.h;
  }

  const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PAPER}"/>
  <circle cx="${CENTER}" cy="${DOT_Y}" r="${DOT_R}" fill="${GOLD}"/>
  ${svg.join('\n  ')}
  <text x="${CENTER}" y="${URL_Y}" font-family="Heebo" font-size="24" fill="${MUTED}" text-anchor="middle">${escape(urlText)}</text>
</svg>`;

  return new Resvg(doc, {
    fitTo: { mode: 'width', value: WIDTH },
    font: { fontFiles: FONT_FILES, loadSystemFonts: false },
  })
    .render()
    .asPng();
}

/** הציטוט כמלל אחד — לטקסט החלופי של התמונה ולבדיקה מול גוף הטור */
export const quoteText = (lines: string[]) => lines.map(stripMarks).join(' ');

/**
 * השוואה שמתעלמת מרווחים, משבירות שורה ומסימני הדגשה — אבל לא מפיסוק,
 * שהוא חלק מהמשפט. הדגשה היא תצוגה: הטור מדגיש קטע אחד והכרטיס עשוי
 * לצבוע קטע אחר, ושניהם עדיין אומרים בדיוק את אותן המילים.
 */
const normalize = (s: string) => stripMarks(s).replace(/\s+/g, ' ').trim();

/**
 * כלל 1.5 של הסקיל: הציטוט שעל התמונה חייב להופיע בגוף הטור מילה במילה.
 * שני ניסוחים לאותו רעיון באותו עמוד מחלישים זה את זה — זה קרה כבר פעמיים
 * (ניצבים, האזינו), ושם זה נתפס בעין. כאן זה מכשיל את הבנייה.
 *
 * שבירת השורה על התמונה היא החלטת עיצוב ואינה חייבת להתאים לשבירה בטור,
 * ולכן ההשוואה מנרמלת רווחים — אבל לא פיסוק, שהוא חלק מהמשפט.
 */
export function assertQuoteInBody(lines: string[], body: string, where: string): void {
  const quote = normalize(quoteText(lines));
  if (!normalize(body).includes(quote)) {
    throw new Error(
      `[${where}] הציטוט שעל התמונה אינו מופיע בגוף הטור מילה במילה:\n  "${quote}"\n` +
        '  או שמתקנים את הציטוט, או שהנוסח החזק יותר נכנס לטקסט ומחליף את הקיים ' +
        '(.claude/skills/mabat-quote-image, סעיף 1.5).'
    );
  }
}
