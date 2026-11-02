// בדיקת כיסוי הנושאים: כמה סיפורים בכל נושא, ואילו סיפורים לא משויכים לאף נושא.
// רץ ידנית (npm run check:themes). עוד לא מחובר לבנייה: יתחבר רק עם עמוד הסיפורים החדש.
import fs from 'node:fs';
import path from 'node:path';
import { THEMES, HOLIDAY_TAGS, themesOf } from '../src/data/themes.mjs';

const dir = 'src/content/stories';
const stories = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const t = fs.readFileSync(path.join(dir, f), 'utf8');
    const fm = t.match(/^---\n([\s\S]*?)\n---/m)?.[1] ?? '';
    const tags = (fm.match(/^tags:\s*\[(.*?)\]/m)?.[1] ?? '')
      .split(',')
      .map((x) => x.trim().replace(/^"|"$/g, ''))
      .filter(Boolean);
    return { id: f.replace(/\.md$/, ''), title: fm.match(/^title:\s*"?(.*?)"?\s*$/m)?.[1] ?? f, tags };
  });

for (const th of THEMES) {
  console.log(`${th.label.padEnd(16)} ${stories.filter((s) => themesOf(s.tags).includes(th)).length}`);
}
const holiday = (s) => s.tags.some((x) => HOLIDAY_TAGS.includes(x));
const orphans = stories.filter((s) => themesOf(s.tags).length === 0 && !holiday(s));
const holidayOnly = stories.filter((s) => themesOf(s.tags).length === 0 && holiday(s));
console.log(`\n${stories.length} סיפורים, ${stories.length - orphans.length - holidayOnly.length} משויכים לנושא, ${holidayOnly.length} סיפורי חג, ${orphans.length} בלי נושא`);
for (const s of orphans) console.log(`  בלי נושא: ${s.id} | ${s.title} | תגיות: ${s.tags.join(', ')}`);
if (holidayOnly.length) console.log(`\n${holidayOnly.length} סיפורי חג בלי נושא, בכוונה: ${holidayOnly.map((s) => s.title).join(', ')}`);
process.exit(orphans.length ? 1 : 0);
