// כלל ברזל: אין מקף גדול (—) באתר. רק מקף בינוני (–).
// החריג היחיד: שורת דיאלוג בספרדית שנפתחת ב-raya — שם המקף הגדול הוא סימן פיסוק
// של השפה (החלטת 4.65), ומקף קטן יותר ייקרא כשגיאה.
// שלוש שורות קוד שמטפלות בשני הסוגים (חיתוך כותרות, כרטיסי שיתוף) מוחרגות אף הן.
// רץ לפני כל בנייה: תוכן חדש עם מקף גדול מכשיל את הבנייה.
import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['src', 'public'];
const TEXT = /\.(md|ts|astro|mjs|js|css|json|txt|svg)$/;
const allowed = (file, line) =>
  (/-es[\\/]/.test(file) && /^\s*(>\s*)?(\*+\s*)?—/.test(line)) ||
  /CLAUSE_BREAKS =|replace\(\/\[\.,:;—–|match\(\/\^\(\[—–/.test(line);

const hits = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (TEXT.test(e.name)) {
      fs.readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
        if (line.includes('—') && !allowed(p, line)) hits.push(`${p}:${i + 1}: ${line.trim()}`);
      });
    }
  }
}
ROOTS.forEach(walk);

if (hits.length) {
  console.error(`נמצא מקף גדול (—) ב-${hits.length} שורות. באתר משתמשים רק במקף בינוני (–):\n`);
  hits.forEach((h) => console.error('  ' + h));
  process.exit(1);
}
console.log('check:dashes: אין מקף גדול באתר.');
