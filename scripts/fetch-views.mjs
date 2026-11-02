// מספרי הצפיות של הסיפורים, מ-PostHog, לפני כל בנייה (2026-11-02).
// כותב את src/data/views.json: לכל סיפור צפיות בעברית, בספרדית וסך הכול (מאז 20.8.2026).
// עקרונות:
//  1. הבנייה לא נכשלת לעולם בגלל הסקריפט הזה. אין מפתח, אין רשת או שגיאה: הקובץ הקיים (הצילום
//     האחרון) נשאר כפי שהוא והסקריפט מסתיים תקין.
//  2. המספר אמיתי: סופרים $pageview בדומיין הציבורי בלבד. אין הוספה ואין עיגול.
//  3. הספרדית נספרת גם בכתובות הישנות (/es/historias/<שם-הקובץ-העברי>), לפני ששונו כתובות
//     הסיפורים בספרדית (שלב 4.67), כדי שלא יאבד מה שנקרא שם.
// משתני סביבה (Vercel): POSTHOG_PERSONAL_API_KEY (הרשאת קריאה), POSTHOG_PROJECT_ID, ואופציונלי POSTHOG_HOST.
import fs from 'node:fs';

const OUT = 'src/data/views.json';
const SINCE = '2026-08-20';

/** שם קובץ עברי -> סלאג ספרדי, מתוך src/data/es-slugs.ts */
export function readEsSlugs(src) {
  const map = {};
  for (const m of src.matchAll(/^\s*'([^']+)':\s*'([^']+)',/gm)) map[m[1]] = m[2];
  return map;
}

/** rows: [[pathname, views], ...] -> { id: { he, es, total } } */
export function aggregate(rows, ids, esMap) {
  const esToId = Object.fromEntries(Object.entries(esMap).map(([id, slug]) => [slug, id]));
  const out = Object.fromEntries(ids.map((id) => [id, { he: 0, es: 0, total: 0 }]));
  for (const [path, n] of rows) {
    const p = String(path).replace(/\/$/, '');
    let id = null;
    let lang = null;
    if (p.startsWith('/stories/')) {
      id = p.slice(9);
      lang = 'he';
    } else if (p.startsWith('/es/historias/')) {
      const slug = p.slice(14);
      id = esToId[slug] ?? slug; // סלאג ספרדי חדש, או שם קובץ עברי (כתובת ישנה)
      lang = 'es';
    }
    if (id && out[id]) out[id][lang] += Number(n);
  }
  for (const v of Object.values(out)) v.total = v.he + v.es;
  return out;
}

async function main() {
  const key = process.env.POSTHOG_PERSONAL_API_KEY;
  const project = process.env.POSTHOG_PROJECT_ID;
  if (!key || !project) {
    console.log('fetch-views: אין מפתח PostHog, נשאר הצילום האחרון של הצפיות.');
    return;
  }
  const host = process.env.POSTHOG_HOST ?? 'https://us.posthog.com';
  const ids = fs
    .readdirSync('src/content/stories')
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
  const esMap = readEsSlugs(fs.readFileSync('src/data/es-slugs.ts', 'utf8'));
  const hogql = `
    SELECT replaceRegexpOne(properties.$pathname, '/$', '') AS p, count() AS views
    FROM events
    WHERE event = '$pageview'
      AND timestamp >= toDateTime('${SINCE}')
      AND properties.$host = 'nekudatmabat.blog'
      AND (properties.$pathname LIKE '/stories/%' OR properties.$pathname LIKE '/es/historias/%')
    GROUP BY p
    LIMIT 1000`;
  const res = await fetch(`${host}/api/projects/${project}/query/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query: hogql } }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`PostHog ${res.status}`);
  const rows = (await res.json()).results;
  if (!Array.isArray(rows) || rows.length === 0) throw new Error('תשובה ריקה');
  const views = aggregate(rows, ids, esMap);
  fs.writeFileSync(OUT, JSON.stringify({ updatedAt: new Date().toISOString().slice(0, 10), since: SINCE, views }, null, 2) + '\n');
  console.log(`fetch-views: עודכנו ${ids.length} סיפורים.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => console.log(`fetch-views: דילגתי (${e.message}), נשאר הצילום האחרון.`));
}
