// כלל ברזל: צבע לא נכתב בקוד. כל הצבעים מוגדרים כטוקנים ב-:root של Base.astro, ושאר הקוד משתמש ב-var(--...).
// החריג: src/lib/moment-card.ts בונה תמונות שיתוף מחוץ ל-CSS, ולכן מחזיק עותק של הפלטה;
// הבדיקה מוודאת שהעותק זהה לטוקנים, כדי ששינוי בצבע לא יישכח שם.
// רץ לפני כל בנייה.
import fs from 'node:fs';
import path from 'node:path';

const HEX = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g;
const base = fs.readFileSync('src/layouts/Base.astro', 'utf8');
const tokens = Object.fromEntries(
  [...base.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)].map((m) => [m[1], m[2].toLowerCase()])
);

const hits = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(astro|css)$/.test(e.name)) {
      fs.readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
        if (/^\s*--[a-z-]+:\s*#/.test(line) && p.endsWith('Base.astro')) return; // הגדרת טוקן
        const code = line.replace(/\/\*.*?\*\//g, '');
        if (HEX.test(code)) hits.push(`${p}:${i + 1}: ${line.trim()}`);
        HEX.lastIndex = 0;
      });
    }
  }
}
walk('src');

const card = fs.readFileSync('src/lib/moment-card.ts', 'utf8');
const pairs = { PAPER: 'surface', INK: 'ink', MUTED: 'muted', GOLD: 'gold', GOLD_DEEP: 'gold-deep', TEAL_DEEP: 'teal-deep', BLUE: 'blue', BRICK: 'brick' };
const drift = [];
for (const [k, t] of Object.entries(pairs)) {
  const m = card.match(new RegExp(`const ${k} = '(#[0-9a-fA-F]{6})'`));
  if (!m) drift.push(`moment-card.ts: חסר ${k}`);
  else if (m[1].toLowerCase() !== tokens[t]) drift.push(`moment-card.ts: ${k}=${m[1]} אבל --${t}=${tokens[t]}`);
}

if (hits.length || drift.length) {
  if (hits.length) {
    console.error(`נמצא צבע קבוע בקוד ב-${hits.length} שורות. משתמשים ב-var(--...):\n`);
    hits.forEach((h) => console.error('  ' + h));
  }
  drift.forEach((d) => console.error('  ' + d));
  process.exit(1);
}
console.log('check:colors: אין צבעים קבועים בקוד, ופלטת תמונות השיתוף תואמת לטוקנים.');
