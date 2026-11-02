// בדיקת התחלפות ההצעות בסוף הסיפור (StoryEnd). לא חלק מהבנייה: דורשת בנייה קיימת ב-dist ודפדפן (playwright).
// פותחת כל סיפור-לדוגמה 15 פעמים בדפדפן נקי, ומוודאת שכל מקום שיש לו כמה מועמדים מציג לפחות שניים שונים.
// שימוש: npm run build && npm run check:rotation
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('check:rotation: חסר playwright (לא מותקן בפרויקט; נדרש רק לבדיקה הזאת).');
  process.exit(2);
}
const DIST = path.resolve('dist');
if (!fs.existsSync(DIST)) {
  console.error('check:rotation: אין dist. להריץ קודם npm run build.');
  process.exit(2);
}
const PAGES = ['/stories/kvar-baavir/', '/stories/hatabaat-bakos/', '/es/historias/ya-en-el-aire/'];
const LOADS = 15;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(DIST, p);
  if (!f.startsWith(DIST) || !fs.existsSync(f)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] ?? 'application/octet-stream' }).end(fs.readFileSync(f));
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;
const browser = await chromium.launch();
const fails = [];
for (const url of PAGES) {
  const seen = { world: new Set(), theme: new Set(), moment: new Set() };
  const total = { world: 0, theme: 0, moment: 0 };
  for (let i = 0; i < LOADS; i++) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(base + url);
    const r = await page.evaluate(() => {
      const out = {};
      for (const slot of ['world', 'theme', 'moment']) {
        const all = [...document.querySelectorAll(`[data-slot="${slot}"] li`)];
        out[slot] = { n: all.length, shown: all.filter((l) => !l.hidden).map((l) => l.dataset.story) };
      }
      return out;
    });
    for (const k of Object.keys(seen)) {
      total[k] = r[k].n;
      r[k].shown.forEach((s) => seen[k].add(s));
    }
    await ctx.close();
  }
  const line = Object.keys(seen).map((k) => `${k}: ${seen[k].size}/${total[k]}`).join(' · ');
  console.log(`${url}  ${line}`);
  for (const k of Object.keys(seen)) {
    if (total[k] > 1 && seen[k].size < 2) fails.push(`${url}: במקום "${k}" יש ${total[k]} מועמדים אבל ב-${LOADS} כניסות הוצג רק אחד`);
    if (total[k] === 0) console.log(`  (אין מועמדים במקום "${k}")`);
  }
}
await browser.close();
server.close();
if (fails.length) {
  console.error('\ncheck:rotation נכשל:\n  ' + fails.join('\n  '));
  process.exit(1);
}
console.log('check:rotation: כל המקומות עם כמה מועמדים מתחלפים בין כניסות.');
