// בדיקה מכנית להודעה לקבוצה (עברית וספרדית). שימוש:
//   npm run check:message -- path/to/message.txt        (או: cat message.txt | npm run check:message)
// כללים: docs/messages/RULES.md. הבדיקה אינה חלק מהבנייה.
import fs from 'node:fs';
import path from 'node:path';

const file = process.argv[2];
const raw = file ? fs.readFileSync(file, 'utf8') : fs.readFileSync(0, 'utf8');
const text = raw.replace(/^```[a-z]*\n?|```\s*$/gm, '').replace(/\r/g, '');
const lines = text.split('\n').map((l) => l.trimEnd());
const body = lines.filter((l) => l.trim() !== '');

const read = (f) => fs.readFileSync(path.join('src/data', f), 'utf8');
const groupHe = read('site.ts').match(/whatsappGroupUrl:\s*'([^']*)'/)?.[1] ?? '';
const groupEs = read('site-es.ts').match(/whatsappGroupUrl:\s*'([^']*)'/)?.[1] ?? '';

const fails = [];
const warns = [];
const fail = (m) => fails.push(m);
const warn = (m) => warns.push(m);

const links = body.filter((l) => /^https?:\/\//.test(l.trim()));
const storyLink = links.find((l) => l.includes('nekudatmabat.blog'));
const isEs = !!storyLink && /\/es\//.test(storyLink);

// תג: wa = הקבוצה, st = הסטטוס האישי. wa-he-r = פרסום חוזר בקבוצה (קישור חדש לוואטסאפ, כשהתצוגה המקדימה נתקעה).
const lang = isEs ? 'es' : 'he';
const tagMatch = storyLink?.trim().match(/\?s=([a-z0-9-]+)$/);
const tagVal = tagMatch?.[1] ?? '';
const okTags = [`wa-${lang}`, `wa-${lang}-r`, `st-${lang}`];
const isStatus = tagVal === `st-${lang}`;
if (!storyLink) fail('אין קישור לאתר');
else if (!okTags.includes(tagVal)) fail(`קישור האתר חייב להסתיים באחד מ: ${okTags.map((t) => '?s=' + t).join(' / ')} (נמצא: ${storyLink.trim()})`);

const groupLink = links.find((l) => l.includes('chat.whatsapp.com'));
if (isStatus) {
  if (links.length < 1 || links.length > 2) fail(`בסטטוס: קישור האתר, ואופציונלית קישור הקבוצה (נמצאו ${links.length})`);
} else if (links.length !== 2) fail(`צריך בדיוק שני קישורים (סיפור וקבוצה), נמצאו ${links.length}`);

// קישור קבוצה
const expected = isEs ? groupEs : groupHe;
if (!groupLink) { if (!isStatus) fail('אין קישור קבוצה'); }
else if (!expected) fail('קישור הקבוצה הספרדי ריק ב-site-es.ts');
else if (groupLink.trim() !== expected) fail(`קישור הקבוצה שונה מזה שבקוד: ${groupLink.trim()}`);

// קיום הסיפור
const slug = storyLink?.match(/\/stories\/([^/?]+)/)?.[1];
if (slug && !fs.existsSync(`src/content/stories/${slug}.md`)) fail(`אין קובץ סיפור בשם ${slug}`);

// שורת כותרת: *שם* 👇 מיד לפני קישור הסיפור
const idx = body.findIndex((l) => l === storyLink);
const titleLine = idx > 0 ? body[idx - 1] : '';
if (!/^\*[^*]+\*\s*👇$/.test(titleLine.trim())) fail(`השורה שלפני הקישור חייבת להיות *שם הסיפור* 👇 (נמצא: "${titleLine}")`);

// שורת הצטרפות
const gi = groupLink ? body.findIndex((l) => l === groupLink) : -1;
const joinLine = gi > 0 ? body[gi - 1] : '';
if (groupLink) {
  if (!isEs && joinLine.trim() !== 'להצטרפות לקבוצה:') fail(`שורת ההצטרפות חייבת להיות "להצטרפות לקבוצה:" (נמצא: "${joinLine}")`);
  if (isEs && !joinLine.trim().endsWith(':')) fail('שורת ההצטרפות הספרדית חייבת להסתיים בנקודתיים');
  if (gi !== body.length - 1) fail('קישור הקבוצה חייב להיות השורה האחרונה');
}

// עד 4 מילים בשורה
const words = (l) => l.replace(/[*_]/g, '').replace(/[\p{Extended_Pictographic}\u{FE0F}]/gu, '')
  .split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
body.forEach((l, i) => {
  if (/^https?:\/\//.test(l.trim()) || l === titleLine || l === joinLine) return;
  const n = words(l);
  if (n > 4) fail(`שורה עם ${n} מילים: "${l}"`);
});

// מקף גדול ו"לפעמים"
text.split('\n').forEach((l) => { if (l.includes('—')) fail(`מקף גדול: "${l}"`); });
if (/לפעמים|a veces/i.test(text)) warn('"לפעמים" – כמעט לא (כלל כתיבה)');

// ביטויי מכירה
for (const p of ['שווה את כל הסיפור', 'חייבים לקרוא', 'לא תאמינו', 'הסיפור שישנה לכם']) {
  if (text.includes(p)) fail(`ביטוי מכירתי: "${p}"`);
}

// גוף ההודעה לפני הכותרת: לא ריק ולא ארוך מדי
const intro = body.slice(0, Math.max(0, idx - 1));
const introWords = intro.reduce((s, l) => s + words(l), 0);
if (introWords === 0) fail('אין גוף להודעה');
if (introWords > 60) warn(`הגוף ארוך (${introWords} מילים). ההודעות הנקיות ביותר 25–45`);
if (!intro.some((l) => /[?]|\.$|:$/.test(l.trim()))) warn('אין שאלה/נקודת עצירה בגוף');

console.log(`שפה: ${isEs ? 'ספרדית' : 'עברית'} · יעד: ${isStatus ? 'סטטוס' : 'קבוצה'} (${tagVal}) · שורות גוף: ${intro.length} · מילים בגוף: ${introWords}`);
warns.forEach((w) => console.log(`⚠️  ${w}`));
if (fails.length) {
  fails.forEach((f) => console.log(`✗ ${f}`));
  console.log(`\nנכשל: ${fails.length} בעיות`);
  process.exit(1);
}
console.log('✓ עבר');
