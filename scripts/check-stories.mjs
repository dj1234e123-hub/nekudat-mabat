// בדיקת איכות לכל סיפור, רצה לפני כל בנייה (2026-11-03). הרעיון: כל סיפור שעולה לאתר ייראה ויתנהג כמו
// כל השאר, בלי לסמוך על זיכרון. הבדיקה נכשלת (והבנייה נעצרת, עם הסבר ושם הקובץ) כשחסר:
//   · hook – שאלה שהסיפור עונה עליה (עברית, וגם בספרדית אם יש תאום). הוא הפיתוי בכל כרטיס באתר.
//   · נושא – תגית ששייכת לאחד הנושאים ב-src/data/themes.mjs, או תגית חג (סיפורי חג אינם צריכים נושא).
//   · תמונת שער עם טקסט חלופי. (חריג: סיפור מוחזק, כלומר תאריך רחוק בעתיד, עדיין בעבודה.)
// אזהרות (לא עוצרות): hook ארוך או שאינו שאלה · אין תאום ספרדי ("מבחר ולא מראה").
// שימוש: node scripts/check-stories.mjs [תיקיית-תוכן]   (ברירת מחדל: src/content)
import fs from 'node:fs';
import path from 'node:path';
import { THEMES, HOLIDAY_TAGS, themesOf } from '../src/data/themes.mjs';

const root = process.argv[2] ?? 'src/content';
const HELD_AFTER_DAYS = 14; // תאריך רחוק יותר = סיפור מוחזק, עדיין בעבודה

function read(dir) {
  const p = path.join(root, dir);
  if (!fs.existsSync(p)) return {};
  return Object.fromEntries(
    fs
      .readdirSync(p)
      .filter((f) => f.endsWith('.md'))
      .map((f) => {
        const t = fs.readFileSync(path.join(p, f), 'utf8');
        const fm = t.match(/^(?:#.*\n)*---\n([\s\S]*?)\n---/)?.[1] ?? '';
        const get = (k) => fm.match(new RegExp(`^${k}:\\s*"?(.*?)"?\\s*$`, 'm'))?.[1] ?? '';
        const tags = (fm.match(/^tags:\s*\[(.*?)\]/m)?.[1] ?? '').split(',').map((x) => x.trim().replace(/^"|"$/g, '')).filter(Boolean);
        const quotes = (t.replace(/^(?:#.*\n)*---\n[\s\S]*?\n---/, '').match(/^>.*(?:\n>.*)*/gm) ?? []).length;
        return [f.replace(/\.md$/, ''), { file: path.join(dir, f), quotes, hook: get('hook'), cover: get('cover'), coverAlt: get('coverAlt'), date: get('date'), tags }];
      })
  );
}

const he = read('stories');
const es = read('stories-es');
// ציטוט אחד בדיוק בכל סיפור (הפסקה החזקה, ב-`>`), לפני התובנה. כמה שורות `>` רצופות = ציטוט אחד.
// חריגים בהחלטת בעל הפרויקט (2026-11-03): הסיפור נחתם על שורה נטויה ולא בציטוט.
const NO_QUOTE_OK = ['005-mitachat-lakash-beauschwitz', '008-lo-ratziti-lachzor-habaita', '009-eifo-hitchil-hasipur-haze', '038-ani-maamin-mehakaron'];
const fails = [];
const warns = [];
const now = Date.now();

for (const [id, s] of Object.entries(he)) {
  const held = Date.parse(s.date) - now > HELD_AFTER_DAYS * 864e5;
  if (!s.hook) fails.push(`${s.file}: חסר hook (שאלה שהסיפור עונה עליה, בגוף "אנחנו", בלי לחשוף את הסיום)`);
  else {
    if (s.hook.split(/\s+/).length > 16) warns.push(`${s.file}: hook ארוך (${s.hook.split(/\s+/).length} מילים)`);
    if (!/\?$/.test(s.hook)) warns.push(`${s.file}: ה-hook אינו שאלה`);
  }
  const holiday = s.tags.some((t) => HOLIDAY_TAGS.includes(t));
  if (themesOf(s.tags).length === 0 && !holiday) {
    fails.push(`${s.file}: אין נושא. להוסיף ל-tags תגית ששייכת לנושא (${THEMES.map((t) => t.label).join(' · ')}) או להרחיב נושא ב-src/data/themes.mjs`);
  }
  if (!held) {
    if (!s.cover) fails.push(`${s.file}: חסרה תמונת שער (cover)`);
    else if (!s.coverAlt) fails.push(`${s.file}: חסר coverAlt לתמונת השער`);
  }
  for (const [lang, x] of [['עברית', s], ['ספרדית', es[id]]]) {
    if (!x) continue;
    if (x.quotes > 1) fails.push(`${x.file}: ${x.quotes} ציטוטים (${lang}). ציטוט אחד לסיפור, השאר כשורה רגילה עם הדגשה`);
    if (x.quotes === 0 && !NO_QUOTE_OK.includes(id)) fails.push(`${x.file}: חסר ציטוט (${lang}). לעטוף ב-\`>\` את השורה החזקה של הסיפור, לפני התובנה`);
  }
  if (!es[id]) warns.push(`${s.file}: אין תאום ספרדי (stories-es/${id}.md). זה מותר, אבל חצי מהקוראים בספרדית`);
}
for (const [id, s] of Object.entries(es)) {
  if (!s.hook) fails.push(`${s.file}: חסר hook בספרדית`);
  if (!he[id]) fails.push(`${s.file}: אין תאום עברי באותו שם קובץ (הזיווג בין השפות נעשה לפי שם הקובץ)`);
}

for (const w of warns) console.log(`אזהרה  ${w}`);
if (fails.length) {
  console.error(`\ncheck:stories נכשל (${fails.length}):`);
  for (const f of fails) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`check:stories: ${Object.keys(he).length} סיפורים בעברית, ${Object.keys(es).length} בספרדית. הכול תקין (${warns.length} אזהרות).`);
