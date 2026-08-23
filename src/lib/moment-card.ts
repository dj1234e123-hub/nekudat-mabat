// יצירת תמונת שיתוף ל"רגע" — נוצרת בזמן הבנייה, לא בזמן ריצה.
//
// למה SVG + resvg ולא satori: satori אינו מיישם את אלגוריתם ה-bidi, ולכן טקסט
// עברי יוצא ממנו הפוך. resvg מעצב טקסט דרך rustybuzz עם bidi מלא — עברית,
// פיסוק וכתובת לטינית בתוך שורה עברית יוצאים נכון.
//
// הפונטים כאן אינם קובצי האתר: תת-הקבוצה העברית ב-public/fonts אינה מכילה
// סימני פיסוק כלל, ולכן נבנו קבצים ייעודיים שממזגים עברית + לטינית, בגרסה
// סטטית (הגרסה המשתנה מכשילה את מנתחי הפונטים).
//
// עקרון העיצוב (מהחלטת בעל הפרויקט): הטקסט הוא הגיבור. בלי סמל העין, בלי
// דמויות, בלי צילומים. המיתוג הוא חתימה שקטה בתחתית ותו זהב אחד.
import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';
import { Resvg } from '@resvg/resvg-js';

const WIDTH = 1200;
const HEIGHT = 630;
const MARGIN = 92;
const TEXT_RIGHT = WIDTH - MARGIN;
// שורת המידה צרה מהכרטיס בכוונה: שורה ברוחב מלא של 1200 פיקסלים קשה למעקב
// לעין, והכרטיס נראה כמו מסמך ולא כמו משהו שרוצים לשתף.
const MAX_TEXT_WIDTH = 920;
/** התחום שבו הטקסט חי; מתחתיו שמורה החתימה */
const TEXT_TOP = 96;
const TEXT_BOTTOM = 470;
const RULE_Y = 524;
const SIGN_Y = 570;

const PAPER = '#fbf7ee';
const INK = '#2e2a24';
const MUTED = '#75695a';
const GOLD = '#c9a24d';
const LINE = '#e7dcc4';

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

/**
 * הגודל הגדול ביותר שבו כל הטקסט עדיין נכנס לתחום.
 * הרגעים נעים בין 36 ל-62 מילים, ולכן גודל קבוע היה משאיר את הקצרים ריקים
 * ואת הארוכים חתוכים.
 */
function fit(paragraphs: string[]) {
  const available = TEXT_BOTTOM - TEXT_TOP;
  for (let size = 44; size >= 27; size -= 1) {
    const lineHeight = size * 1.58;
    const paragraphGap = size * 0.8;
    const blocks = paragraphs.map((p) => wrap(p, size));
    const lineCount = blocks.reduce((sum, b) => sum + b.length, 0);
    const height = lineCount * lineHeight + (blocks.length - 1) * paragraphGap;
    if (height <= available) return { size, lineHeight, paragraphGap, blocks, height };
  }
  const size = 27;
  const lineHeight = size * 1.58;
  const paragraphGap = size * 0.8;
  const blocks = paragraphs.map((p) => wrap(p, size));
  const lineCount = blocks.reduce((sum, b) => sum + b.length, 0);
  return {
    size,
    lineHeight,
    paragraphGap,
    blocks,
    height: lineCount * lineHeight + (blocks.length - 1) * paragraphGap,
  };
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
        `<text x="${TEXT_RIGHT}" y="${y.toFixed(1)}" font-family="Frank Ruhl Libre" font-size="${size}" fill="${INK}" direction="rtl" text-anchor="end">${escape(line)}</text>`
      );
      y += lineHeight;
    }
    if (index < blocks.length - 1) y += paragraphGap;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PAPER}"/>
  <rect x="0" y="0" width="${WIDTH}" height="10" fill="${GOLD}"/>
  ${lines.join('\n  ')}
  <line x1="${MARGIN}" y1="${RULE_Y}" x2="${WIDTH - MARGIN}" y2="${RULE_Y}" stroke="${LINE}" stroke-width="2"/>
  <circle cx="${TEXT_RIGHT - 5}" cy="${SIGN_Y - 9}" r="6" fill="${GOLD}"/>
  <text x="${TEXT_RIGHT - 26}" y="${SIGN_Y}" font-family="Heebo Bold" font-size="27" fill="${INK}" direction="rtl" text-anchor="end">נקודת מבט · אפרים עטיה</text>
  <text x="${MARGIN}" y="${SIGN_Y}" font-family="Heebo" font-size="23" fill="${MUTED}" text-anchor="start">${escape(siteHost)}</text>
</svg>`;

  return new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
    font: { fontFiles: FONT_FILES, loadSystemFonts: false },
  })
    .render()
    .asPng();
}
