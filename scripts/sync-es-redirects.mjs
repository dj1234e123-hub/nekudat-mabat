// מסנכרן את ההפניות מהכתובות הספרדיות הישנות (שם הקובץ העברי המשועתק)
// אל החדשות (ספרדית) ב-vercel.json — מתוך src/data/es-slugs.ts, שהוא
// מקור האמת היחיד.
//
//   node scripts/sync-es-redirects.mjs         — כותב
//   node scripts/sync-es-redirects.mjs --check — רק בודק, יוצא 1 אם לא מסונכרן
//
// vercel.json נקרא ע"י Vercel **לפני** הבנייה, ולכן ההפניות חייבות להיות
// מחויבות לריפו ואי אפשר לייצר אותן בזמן build.
import { readFileSync, writeFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/data/es-slugs.ts', import.meta.url), 'utf8');

function mapOf(name) {
  const body = src.split(`export const ${name}`)[1].split('};')[0];
  const out = {};
  for (const m of body.matchAll(/^\s*'?([\w-]+)'?:\s*'([^']+)'/gm)) out[m[1]] = m[2];
  return out;
}

const stories = mapOf('ES_STORY_SLUGS');
const sections = mapOf('ES_SECTION_SLUGS');

// הבלוק המנוהל מזוהה לפי הקידומת ולא לפי שדה סימון: Vercel מאמת את
// vercel.json מול סכמה, ומפתח לא מוכר בתוך redirect עלול להכשיל פריסה.
const OWNED = /^\/es\/(historias|secciones)\//;
const generated = [
  ...Object.entries(stories).map(([id, slug]) => [`/es/historias/${id}/`, `/es/historias/${slug}/`]),
  ...Object.entries(sections).map(([id, slug]) => [`/es/secciones/${id}/`, `/es/secciones/${slug}/`]),
]
  .filter(([from, to]) => from !== to)
  .map(([source, destination]) => ({ source, destination, permanent: true }));

const path = new URL('../vercel.json', import.meta.url);
const cfg = JSON.parse(readFileSync(path, 'utf8'));
const kept = (cfg.redirects ?? []).filter((r) => !OWNED.test(r.source));
const next = { ...cfg, redirects: [...kept, ...generated] };

const before = readFileSync(path, 'utf8');
const after = JSON.stringify(next, null, 2) + '\n';

if (process.argv.includes('--check')) {
  if (before !== after) {
    console.error('vercel.json אינו מסונכרן עם es-slugs.ts — הריצו: npm run sync:es-redirects');
    process.exit(1);
  }
  console.log(`✓ ${generated.length} הפניות ספרדיות מסונכרנות`);
} else {
  writeFileSync(path, after);
  console.log(`✓ נכתבו ${generated.length} הפניות ל-vercel.json`);
}
