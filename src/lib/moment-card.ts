// יצירת תמונת השיתוף של "רגע" — נוצרת בזמן הבנייה, מהטקסט עצמו.
//
// התמונה נושאת את אותם ארבעת השלבים של הרגע (docs/MOMENT-FORMAT.md):
// כותרת → המציאות → המסקנה → הסיבוב → קישוט → סיום מובלט.
//
// מה נשאר מההחלטות הקודמות: רקע שמנת, נקודת זהב אחת למעלה, בתחתית קו זהב קצר,
// החתימה וכתובת האתר. בלי סמל העין, בלי דמויות, בלי צילומים — ובלי שם המצב,
// שהיה מתייג את מי שמשתף.
//
// 1080x1350 (יחס 4:5): התמונה נועדה בראש ובראשונה לסטטוס וואטסאפ, ושם
// פורמט רוחבי נחתך.
//
// למה resvg ולא satori: satori אינו מיישם את אלגוריתם ה-bidi, ולכן עברית
// יוצאת ממנו הפוכה מילה-מילה. resvg מעצב דרך rustybuzz, עם bidi מלא.
// למה בזמן בנייה ולא כקבצים מוכנים בריפו: כשהטקסט משתנה התמונה מתעדכנת מעצמה.
//
// הפונטים כאן אינם קובצי האתר: תת-הקבוצה העברית ב-public/fonts אינה מכילה
// סימני פיסוק כלל, ולכן נבנו קבצים ייעודיים שממזגים עברית + לטינית, בגרסה
// סטטית (הגרסה המשתנה מכשילה את מנתחי הפונטים).
import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';
import { Resvg } from '@resvg/resvg-js';
import { parseMoment, plain, type MomentFormat } from './moment-format';

const WIDTH = 1080;
const HEIGHT = 1350;
const CENTER = WIDTH / 2;
const MARGIN = 118;
const MAX_TEXT_WIDTH = WIDTH - MARGIN * 2;

/** התחום שבו הטקסט חי — בין נקודת הזהב לקו התחתון */
const TEXT_TOP = 160;
const TEXT_BOTTOM = 1110;

const DOT_Y = 99;
const DOT_R = 7.5;
const RULE_Y = 1169;
const RULE_HALF = 35;
const SIGN_Y = 1232;
const URL_Y = 1272;

const PAPER = '#f3e9d3';
const INK = '#2e2a24';
const MUTED = '#75695a';
const GOLD = '#c9a24d';
const TEAL_DEEP = '#17453f';
const BLUE = '#003b5c';
const BRICK = '#b0463b';

const REGULAR = 'Frank Ruhl Libre';
const BOLD = 'Frank Ruhl Libre Bold';

// מבוסס על תיקיית הפרויקט ולא על import.meta.url: הקוד הזה רץ אחרי האריזה,
// מתוך dist/, ושם הנתיב היחסי כבר לא מצביע על קובצי המקור.
const fontPath = (name: string) => path.resolve(process.cwd(), 'src/assets/og-fonts', `${name}.ttf`);
const FONT_FILES = ['frank', 'frank-bold', 'heebo', 'heebo-bold'].map(fontPath);

/** נטען פעם אחת לכל הבנייה — 66 תמונות מאותם קבצים. */
function load(name: string) {
  const buffer = fs.readFileSync(fontPath(name));
  return opentype.parse(
    buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
  );
}
const FONTS: Record<string, opentype.Font> = {
  [REGULAR]: load('frank'),
  [BOLD]: load('frank-bold'),
};

/**
 * רוחב הטקסט בפיקסלים בגודל נתון, לפי טבלת הרוחבים של הפונט עצמו.
 * מסכם תו-תו במקום getAdvanceWidth: הפונקציה ההיא מפעילה את מנוע העיצוב של
 * opentype.js, שקורס על טקסט עברי. כאן דרוש רק רוחב — לשבירת שורות בלבד;
 * את העיצוב האמיתי עושה resvg.
 */
function measure(text: string, size: number, family = REGULAR): number {
  const font = FONTS[family];
  const scale = size / font.unitsPerEm;
  let width = 0;
  for (const char of text) {
    width += (font.charToGlyph(char).advanceWidth ?? 0) * scale;
  }
  return width;
}

/** שבירת טקסט לשורות שנכנסות לרוחב, מילה שלמה בכל פעם */
function wrap(text: string, size: number, family = REGULAR): string[] {
  const lines: string[] = [];
  let current = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && measure(plain(candidate), size, family) > MAX_TEXT_WIDTH) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);

  // שורה לא מתחילה בסימן פיסוק. הפיסוק ניטרלי מבחינת כיווניות, ובתחילת שורה
  // הוא נוחת בצד הלא נכון וגם קוטע את הקריאה; הוא חוזר לשורה שלפניו.
  for (let i = 1; i < lines.length; i += 1) {
    const match = lines[i].match(/^([—–\-,.:;!?]+)\s+/);
    if (match) {
      lines[i - 1] += ` ${match[1]}`;
      lines[i] = lines[i].slice(match[0].length);
    }
  }
  // מילה בודדת שנשארה לבדה בשורה אחרונה נראית כמו טעות. מושכים אליה מילה
  // מהשורה שמעליה, כל עוד שתיהן עדיין נכנסות.
  if (lines.length > 1) {
    const last = lines[lines.length - 1];
    const previous = lines[lines.length - 2].split(' ');
    if (measure(plain(last), size, family) < MAX_TEXT_WIDTH * 0.3 && previous.length > 2) {
      const moved = previous.pop() as string;
      const balanced = `${moved} ${last}`;
      if (measure(plain(balanced), size, family) <= MAX_TEXT_WIDTH) {
        lines[lines.length - 2] = previous.join(' ');
        lines[lines.length - 1] = balanced;
      }
    }
  }

  return lines.filter(Boolean);
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * RLO (U+202E) … PDF (U+202C): תווי כיווניות בלתי-נראים, לא סימני פיסוק.
 * בלעדיהם resvg ממקם תווים ניטרליים (פיסוק, גרשיים) בקצה ה*לא* נכון של
 * שורה עברית ממורכזת — ולפעמים אף הופך שניים כאלה זה ביחס לזה — במיוחד
 * כשיש יותר מאשכול ניטרלי אחד בשורה (למשל גרש פותח וגרש+נקודה סוגרים).
 * נבדק ואומת ישירות בפיקסלים של ה-PNG שנוצר, לא רק בקוד. RLO כופה סדר
 * תצוגה נכון (override) על פני כל אלגוריתם ניחוש; PDF סוגר את התחום.
 * עוטף את כל השורה — כולל דרך tspan של הדגשה — כי resvg מעצב את כל
 * אלמנט הטקסט כיחידה אחת. לא נוגע בתו אחד מהטקסט הנראה.
 */
const RLO = '‮';
const PDF = '‬';

/**
 * שורה אחת → תוכן של <text>, עם ההדגשות כ-tspan בגופן הכבד.
 * resvg מעצב את כל אלמנט הטקסט כיחידה אחת, ולכן ה-bidi נשמר גם כשיש בתוכו
 * כמה גופנים — וזה מה שמאפשר להדגיש מילה בתוך שורה עברית.
 */
function inline(line: string): string {
  const body = line
    .split(/(\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('**') && part.endsWith('**')
        ? `<tspan font-family="${BOLD}">${escape(part.slice(2, -2))}</tspan>`
        : escape(part)
    )
    .join('');
  return `${RLO}${body}${PDF}`;
}

/** פריט מוכן לציור, עם מיקום אנכי מוחלט */
type Item =
  | { kind: 'line'; text: string; size: number; family: string; fill: string; baseline: number }
  | { kind: 'ornament' }
  | { kind: 'title-rule' };

/** פריט עם הגובה שהוא תופס בפריסה */
type Placed = { item: Item; h: number };

/** מפרט הפורמט החדש, ביחסים לגודל הבסיס — כדי שהכול יתכווץ יחד */
const TITLE_RATIO = 1.66;
const CLOSING_RATIO = 1.38;
const LINE_RATIO = 1.52;
const FLOW_LINE_RATIO = 1.78;
const STANZA_GAP_RATIO = 1.0;
/** המרווח של התצוגה הישנה, נשמר כפי שהיה כדי שכרטיס שטרם הוגר לא ישתנה */
const FLOW_GAP_RATIO = 0.87;
const TITLE_RULE_GAP = 0.8;
const TITLE_GAP_RATIO = 1.7;
const ORNAMENT_GAP_RATIO = 1.45;

/**
 * גודל הבסיס. בתצוגה הישנה זה הגודל של הסקיצה שאושרה, והוא קבוע.
 * בפורמט החדש הוא תקרה: הכרטיס הוא 4:5 ולכן הגובה מוגבל, והרגע נכנס בגודל
 * הגדול ביותר שהוא נכנס בו. הקצה התחתון נשמר גבוה מספיק כדי שרגע ארוך
 * מהרגיל עדיין ייקרא בטלפון.
 */
const BASE_SIZE = 38;
const NEW_MAX_SIZE = 34;
const MIN_SIZE = 26;

/**
 * פריסה אנכית של הרגע כולו. מחזירה את הפריטים ואת הגובה הכולל, כדי שאפשר
 * יהיה למרכז את הגוש ולבדוק אם הוא נכנס.
 */
function compose(format: MomentFormat, size: number) {
  const items: Placed[] = [];
  const push = (item: Item, h: number) => items.push({ item, h });
  /** רווח בלבד, בלי טקסט */
  const gap = (h: number) => push({ kind: 'line', text: '', size: 0, family: REGULAR, fill: INK, baseline: 0 }, h);

  const flow = !format.isNew;
  const lineHeight = (flow ? FLOW_LINE_RATIO : LINE_RATIO) * size;

  if (format.title) {
    const titleSize = size * TITLE_RATIO;
    const titleHeight = titleSize * 1.34;
    for (const line of wrap(format.title, titleSize, BOLD)) {
      push(
        { kind: 'line', text: line, size: titleSize, family: BOLD, fill: BLUE, baseline: titleHeight * 0.76 },
        titleHeight
      );
    }
    push({ kind: 'title-rule' }, size * TITLE_RULE_GAP * 2);
    gap(size * (TITLE_GAP_RATIO - 1));
  }

  format.stanzas.forEach((stanza, index) => {
    // בפורמט החדש השורה נשמרת כפי שנכתבה — היא הפיסוק האמיתי של הרגע.
    // wrap כאן הוא רשת ביטחון לשורה חריגה באורכה בלבד.
    const lines = flow ? wrap(stanza.join(' '), size) : stanza.flatMap((l) => wrap(l, size));
    // ה-baseline של התצוגה הישנה נשמר בדיוק כפי שהיה (size ולא יחס מגובה
    // השורה), כדי שכרטיס שטרם הוגר ייצא זהה לחלוטין לקודמו.
    const baseline = flow ? size : lineHeight * 0.76;
    for (const line of lines) {
      push({ kind: 'line', text: line, size, family: REGULAR, fill: INK, baseline }, lineHeight);
    }
    if (index < format.stanzas.length - 1) {
      gap(size * (flow ? FLOW_GAP_RATIO : STANZA_GAP_RATIO));
    }
  });

  if (format.closing) {
    push({ kind: 'ornament' }, size * ORNAMENT_GAP_RATIO * 2);
    const closingSize = size * CLOSING_RATIO;
    const closingHeight = closingSize * 1.4;
    for (const line of format.closing.flatMap((l) => wrap(l, closingSize, BOLD))) {
      push(
        { kind: 'line', text: line, size: closingSize, family: BOLD, fill: BRICK, baseline: closingHeight * 0.76 },
        closingHeight
      );
    }
  }

  const height = items.reduce((sum, i) => sum + i.h, 0);
  return { items, height };
}

/** קטן מהגודל הקבוע רק אם רגע חריג באורכו לא נכנס — רשת ביטחון, לא ברירת מחדל. */
function fit(format: MomentFormat) {
  const available = TEXT_BOTTOM - TEXT_TOP;
  const start = format.isNew ? NEW_MAX_SIZE : BASE_SIZE;
  for (let size = start; size >= MIN_SIZE; size -= 1) {
    const candidate = compose(format, size);
    if (candidate.height <= available) return candidate;
  }
  return compose(format, MIN_SIZE);
}

function ornamentSvg(y: number): string {
  const half = 46;
  const gap = 16;
  const d = 7;
  return [
    `<line x1="${CENTER - half - gap}" y1="${y}" x2="${CENTER - gap}" y2="${y}" stroke="${GOLD}" stroke-width="1.6" opacity="0.75"/>`,
    `<line x1="${CENTER + gap}" y1="${y}" x2="${CENTER + half + gap}" y2="${y}" stroke="${GOLD}" stroke-width="1.6" opacity="0.75"/>`,
    `<rect x="${CENTER - d / 2}" y="${y - d / 2}" width="${d}" height="${d}" fill="${GOLD}" transform="rotate(45 ${CENTER} ${y})"/>`,
  ].join('\n  ');
}

export function renderMomentCard(body: string, siteHost: string, title?: string | null): Buffer {
  const format = parseMoment(body, title);
  const { items, height } = fit(format);

  // מרכוז אנכי של גוש הטקסט בתוך התחום שלו. Math.max שומר על הקצה העליון:
  // רגע ארוך מהרגיל יגלוש למטה ולא ידרוס את נקודת הזהב שבראש הכרטיס.
  let cursor = Math.max(TEXT_TOP, TEXT_TOP + (TEXT_BOTTOM - TEXT_TOP - height) / 2);
  const svg: string[] = [];

  for (const { item, h } of items) {
    if (item.kind === 'line') {
      if (item.text) {
        const y = cursor + item.baseline;
        svg.push(
          `<text x="${CENTER}" y="${y.toFixed(1)}" font-family="${item.family}" font-size="${item.size}" fill="${item.fill}" direction="rtl" text-anchor="middle">${inline(item.text)}</text>`
        );
      }
    } else if (item.kind === 'ornament') {
      svg.push(ornamentSvg(Number((cursor + h / 2).toFixed(1))));
    } else if (item.kind === 'title-rule') {
      const y = (cursor + h / 2).toFixed(1);
      svg.push(
        `<line x1="${CENTER - 58}" y1="${y}" x2="${CENTER + 58}" y2="${y}" stroke="${GOLD}" stroke-width="1.6" opacity="0.8"/>`
      );
    }
    cursor += h;
  }

  const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PAPER}"/>
  <circle cx="${CENTER}" cy="${DOT_Y}" r="${DOT_R}" fill="${GOLD}"/>
  ${svg.join('\n  ')}
  <line x1="${CENTER - RULE_HALF}" y1="${RULE_Y}" x2="${CENTER + RULE_HALF}" y2="${RULE_Y}" stroke="${GOLD}" stroke-width="2"/>
  <text x="${CENTER}" y="${SIGN_Y}" font-family="Heebo Bold" font-size="30" fill="${TEAL_DEEP}" direction="rtl" text-anchor="middle">${RLO}נקודת מבט · אפרים עטיה${PDF}</text>
  <text x="${CENTER}" y="${URL_Y}" font-family="Heebo" font-size="24" fill="${MUTED}" text-anchor="middle">${escape(siteHost)}</text>
</svg>`;

  return new Resvg(doc, {
    fitTo: { mode: 'width', value: WIDTH },
    font: { fontFiles: FONT_FILES, loadSystemFonts: false },
  })
    .render()
    .asPng();
}
