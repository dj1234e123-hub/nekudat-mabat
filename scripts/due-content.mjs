// בודק אם יש תוכן שתאריך הפרסום שלו הגיע זה עתה (שדה date ב-frontmatter).
// isPublished הוא שער ולא שעון: תוכן עם תאריך עתידי לא נבנה, ולכן צריך בנייה אחרי שהשעה עברה.
// שימוש: node scripts/due-content.mjs [דקות אחורה, ברירת מחדל 40]
// מדפיס את הפריטים, ובתוך GitHub Actions כותב due=true/false ל-GITHUB_OUTPUT.
import { readdirSync, readFileSync, appendFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const minutes = Number(process.argv[2] ?? 40);
const now = Date.now();
const from = now - minutes * 60_000;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (p.endsWith('.md')) yield p;
  }
}

const due = [];
for (const file of walk('src/content')) {
  const m = readFileSync(file, 'utf8').match(/^date:\s*["']?([^"'\s]+)["']?\s*$/m);
  if (!m || m[1].length < 20) continue; // תאריך בלי שעה = תוכן ישן, אינו מתוזמן
  const t = Date.parse(m[1]);
  if (t > from && t <= now) due.push(`${m[1]}  ${file}`);
}

console.log(due.length ? `מועד פרסום הגיע (${minutes} דקות אחרונות):\n${due.join('\n')}` : 'אין תוכן שמועדו הגיע.');
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `due=${due.length > 0}\n`);
