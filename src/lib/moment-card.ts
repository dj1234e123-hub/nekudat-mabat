// יצירת תמונת השיתוף של "רגע" — נוצרת בזמן הבנייה, מהטקסט עצמו.
//
// העיצוב הוא זה שאושר ע"י בעל הפרויקט: רקע שמנת, נקודת זהב אחת למעלה,
// הטקסט ממורכז באמצע, ובתחתית קו זהב קצר, החתימה וכתובת האתר.
// בלי סמל העין, בלי דמויות, בלי צילומים — ובלי שם המצב, שהיה מתייג את מי
// שמשתף (אותו היגיון שהוביל להחלטה שלא יהיה מדף בשם "התמכרות").
//
// 1080x1350 (יחס 4:5): התמונה נועדה בראש ובראשונה לסטטוס וואטסאפ, ושם
// פורמט רוחבי נחתך.
//
// למה resvg ולא satori: satori אינו מיישם את אלגוריתם ה-bidi, ולכן עברית
// יוצאת ממנו הפוכה מילה-מילה. resvg מעצב דרך rustybuzz, עם bidi מלא.
// למה בזמן בנייה ולא כקבצים מוכנים בריפו: כשהטקסט משתנה התמונה מתעדכנת
// מעצמה. תמונות שנוצרות בהרצה ידנית מתיישנות בשקט ברגע שנוגעים בתוכן.
//
// הפונטים כאן אינם קובצי האתר: תת-הקבוצה העברית ב-public/fonts אינה מכילה
// סימני פיסוק כלל, ולכן נבנו קבצים ייעודיים שממזגים עברית + לטינית, בגרסה
// סטטית (הגרסה המשתנה מכשילה את מנתחי הפונטים).
import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';
import { Resvg } from '@resvg/resvg-js';

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

// מבוסס על תיקיית הפרויקט ולא על import.meta.url: הקוד הזה רץ אחרי האריזה,
// מתוך dist/, ושם הנתיב היחסי כבר לא מצביע על קובצי המקור.
const fontPath = (name: string) => path.resolve(process.cwd(), 'src/assets/og-fonts', `${name}.ttf`);
const FONT_FILES = ['frank', 'heebo', 'heebo-bold'].map(fontPath);

// נטען פעם אחת לכל הבנייה — 66 תמונות מאותם קבצים.
const frankBuffer = fs.readFileSync(fontPath('frank'));
const frank = opentype.parse(
  frankBuffer.buffer.slice(frankBuffer.byteOffset, frankBuffer.byteOffset + frankBuffer.byteLength)
);

/**
 * רוחב הטקסט בפיקסלים בגודל נתון, לפי טבלת הרוחבים של הפונט עצמו.
 * מסכם תו-תו במקום getAdvanceWidth: הפונקציה ההיא מפעילה את מנוע העיצוב של
 * opentype.js, שקורס על טקסט עברי. כאן דרוש רק רוחב — לשבירת שורות בלבד;
 * את העיצוב האמיתי עושה resvg.
 */
function measure(text: string, size: number): number {
  const scale = size / frank.unitsPerEm;
  let width = 0;
  for (const char of text) {
    width += (frank.charToGlyph(char).advanceWidth ?? 0) * scale;
  }
  return width;
}

/** שבירת פסקה לשורות שנכנסות לרוחב, מילה שלמה בכל פעם */
function wrap(paragraph: string, size: number): string[] {
  const lines: string[] = [];
  let current = '';
  for (const word of paragraph.split(/\s+/).filter(Boolean)) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && measure(candidate, size) > MAX_TEXT_WIDTH) {
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
    if (measure(last, size) < MAX_TEXT_WIDTH * 0.3 && previous.length > 2) {
      const moved = previous.pop() as string;
      const balanced = `${moved} ${last}`;
      if (measure(balanced, size) <= MAX_TEXT_WIDTH) {
        lines[lines.length - 2] = previous.join(' ');
        lines[lines.length - 1] = balanced;
      }
    }
  }

  return lines.filter(Boolean);
}

const LINE_RATIO = 1.78;
const GAP_RATIO = 0.87;

/** הגודל של הסקיצה שאושרה. קבוע לכל התמונות — שפה עיצובית אחידה מזוהה
 *  מיד, וגודל שמשתנה מרגע לרגע שובר בדיוק את זה. */
const BASE_SIZE = 38;

function layout(paragraphs: string[], size: number) {
  const lineHeight = size * LINE_RATIO;
  const paragraphGap = size * GAP_RATIO;
  const blocks = paragraphs.map((p) => wrap(p, size));
  const lineCount = blocks.reduce((sum, b) => sum + b.length, 0);
  const height = lineCount * lineHeight + (blocks.length - 1) * paragraphGap;
  return { size, lineHeight, paragraphGap, blocks, height };
}

/** קטן מהגודל הקבוע רק אם רגע חריג באורכו לא נכנס — רשת ביטחון, לא ברירת מחדל. */
function fit(paragraphs: string[]) {
  const available = TEXT_BOTTOM - TEXT_TOP;
  for (let size = BASE_SIZE; size >= 26; size -= 1) {
    const candidate = layout(paragraphs, size);
    if (candidate.height <= available) return candidate;
  }
  return layout(paragraphs, 26);
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** גוף הרגע כפי שהוא נשמר ב-Markdown → פסקאות נקיות */
export function toParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

export function renderMomentCard(body: string, siteHost: string): Buffer {
  const { size, lineHeight, paragraphGap, blocks, height } = fit(toParagraphs(body));

  // מרכוז אנכי של גוש הטקסט בתוך התחום שלו
  let y = TEXT_TOP + (TEXT_BOTTOM - TEXT_TOP - height) / 2 + size;
  const lines: string[] = [];
  blocks.forEach((block, index) => {
    for (const line of block) {
      lines.push(
        `<text x="${CENTER}" y="${y.toFixed(1)}" font-family="Frank Ruhl Libre" font-size="${size}" fill="${INK}" direction="rtl" text-anchor="middle">${escape(line)}</text>`
      );
      y += lineHeight;
    }
    if (index < blocks.length - 1) y += paragraphGap;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PAPER}"/>
  <circle cx="${CENTER}" cy="${DOT_Y}" r="${DOT_R}" fill="${GOLD}"/>
  ${lines.join('\n  ')}
  <line x1="${CENTER - RULE_HALF}" y1="${RULE_Y}" x2="${CENTER + RULE_HALF}" y2="${RULE_Y}" stroke="${GOLD}" stroke-width="2"/>
  <text x="${CENTER}" y="${SIGN_Y}" font-family="Heebo Bold" font-size="30" fill="${TEAL_DEEP}" direction="rtl" text-anchor="middle">נקודת מבט · אפרים עטיה</text>
  <text x="${CENTER}" y="${URL_Y}" font-family="Heebo" font-size="24" fill="${MUTED}" text-anchor="middle">${escape(siteHost)}</text>
</svg>`;

  return new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
    font: { fontFiles: FONT_FILES, loadSystemFonts: false },
  })
    .render()
    .asPng();
}
