// תמונת זהות קבועה ל"מעשה שהיה" — og:image משותף לכל סיפורי הפינה.
// נבנית פעם אחת (לא בזמן הבנייה של כל האתר, כי היא לא תלויה בתוכן שמשתנה),
// באותו צינור בדיוק כמו תמונות "רגע של נקודת מבט" (resvg + rustybuzz,
// bidi מלא, אותם קובצי הפונט הייעודיים).
import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const WIDTH = 1080;
const HEIGHT = 1350;
const CENTER = WIDTH / 2;

const PAPER = '#f3e9d3';
const INK = '#2e2a24';
const MUTED = '#75695a';
const GOLD = '#c9a24d';
const TEAL = '#1f5c57';
const TEAL_DEEP = '#17453f';

const fontPath = (name) => path.resolve(process.cwd(), 'src/assets/og-fonts', `${name}.ttf`);
const FONT_FILES = ['frank', 'frank-bold', 'heebo', 'heebo-bold'].map(fontPath);

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// RLO...PDF: אותו תיקון bidi בדיוק כמו moment-card.ts — הכרחי כאן כי לשורת
// הציטוט יש פסיק ונקודה (תווים ניטרליים) שבלעדי זה נוחתים בקצה הלא נכון.
const RLO = '‮';
const PDF = '‬';
const rtl = (text) => `${RLO}${escape(text)}${PDF}`;

// נר קטן בקו זהב — חזרה לגרסה הפשוטה, מוגדל. הד לחותם השעווה ולאיור
// הרקע של הפינה בדף עצמו, בלי לצייר סצנה: רק קו ולהבה.
function candleSvg(cx, cy, scale = 1) {
  const stick = 35 * scale;
  const tip = 46 * scale;
  const flame = 16 * scale;
  return `
  <line x1="${cx}" y1="${cy + stick}" x2="${cx}" y2="${cy - stick * 0.4}" stroke="${GOLD}" stroke-width="${3 * scale}" stroke-linecap="round"/>
  <path d="M${cx} ${cy - tip}c${5 * scale} ${8 * scale} ${flame * 0.5} ${13 * scale} ${flame * 0.5} ${18 * scale}a${flame * 0.5} ${flame * 0.5} 0 1 1-${flame} 0c0-${5 * scale} ${3 * scale}-${10 * scale} ${flame * 0.5}-${18 * scale}Z" fill="${GOLD}"/>`;
}

const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PAPER}"/>

  ${candleSvg(CENTER, 660, 1.4)}

  <text x="${CENTER}" y="830" font-family="Frank Ruhl Libre Bold" font-size="130" fill="${TEAL}" direction="rtl" text-anchor="middle">${rtl('מעשה שהיה')}</text>

  <text x="${CENTER}" y="940" font-family="Frank Ruhl Libre" font-size="56" fill="${INK}" direction="rtl" text-anchor="middle">${rtl('סיפור אחד, ואחריו — שבוע חדש.')}</text>

  <line x1="${CENTER - 50}" y1="1030" x2="${CENTER + 50}" y2="1030" stroke="${GOLD}" stroke-width="2.5"/>

  <text x="${CENTER}" y="1224" font-family="Heebo Bold" font-size="30" fill="${TEAL_DEEP}" direction="rtl" text-anchor="middle">${rtl('נקודת מבט · אפרים עטיה')}</text>
  <text x="${CENTER}" y="1264" font-family="Heebo" font-size="24" fill="${MUTED}" text-anchor="middle">${escape('nekudatmabat.blog')}</text>
</svg>`;

const png = new Resvg(doc, {
  fitTo: { mode: 'width', value: WIDTH },
  font: { fontFiles: FONT_FILES, loadSystemFonts: false },
})
  .render()
  .asPng();

const outDir = path.resolve(process.cwd(), 'src/assets/besht');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'og-identity.png');
fs.writeFileSync(outPath, png);
console.log('written', outPath, png.length, 'bytes');
