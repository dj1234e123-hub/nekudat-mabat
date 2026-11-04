// בדיקת מראה אוטומטית לפי docs/DESKTOP-DESIGN.md (שלב 4.114).
// שימוש: node scripts/qa-visual.mjs [כתובת] [--out תיקייה]
//   כתובת ברירת מחדל: http://localhost:4321 (אחרי npm run build && npm run preview)
//   נגד האתר החי: node scripts/qa-visual.mjs https://nekudatmabat.blog
// Playwright אינו תלות של הפרויקט (כלל 7): מותקן גלובלית, או npm i --no-save playwright.
// יוצא עם קוד 1 אם נמצאה בעיה, ושומר צילומי מסך של כל עמוד וכל רוחב.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const OUT = outIdx >= 0 ? args.splice(outIdx, 2)[1] : join(tmpdir(), 'qa-visual');
const BASE = (args[0] || 'http://localhost:4321').replace(/\/$/, '');
const WIDTHS = [390, 1280, 1920];
mkdirSync(OUT, { recursive: true });

function loadPlaywright() {
  const req = createRequire(import.meta.url);
  try {
    return req('playwright');
  } catch {
    const root = execSync('npm root -g').toString().trim();
    return createRequire(join(root, 'x.js'))('playwright');
  }
}
const { chromium } = loadPlaywright();

// קישור ראשון מעמוד אינדקס: אין צורך לעדכן רשימה כשהתוכן מתחלף
async function firstLink(page, indexUrl, prefix) {
  await page.goto(BASE + indexUrl, { waitUntil: 'networkidle' });
  return page.evaluate((p) => {
    const a = [...document.querySelectorAll('main a[href]')]
      .map((x) => x.getAttribute('href'))
      .find((h) => h && h.startsWith(p) && h.replace(/\/$/, '').split('/').length > p.replace(/\/$/, '').split('/').length);
    return a || null;
  }, prefix);
}

const IGNORED = [/_vercel\//, /posthog/i, /favicon/];
const fails = [];
const log = (w, name, msg) => fails.push(`${w}px ${name}: ${msg}`);

const browser = await chromium.launch();
const probe = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
const pages = {
  'דף בית': '/',
  'סיפורים': '/stories/',
  'סיפור': await firstLink(probe, '/stories/', '/stories/'),
  'רגעים': '/moments/',
  'רגע': await firstLink(probe, '/moments/anger/', '/moments/anger/'),
  'מבט לשבת': '/mabat-leshabbat/',
  'גיליון': await firstLink(probe, '/mabat-leshabbat/', '/mabat-leshabbat/'),
  'מעשה שהיה': '/besht/',
  'מי אני': '/about/',
  'ספרדית בית': '/es/',
  'ספרדית סיפורים': '/es/historias/',
  'ספרדית סיפור': await firstLink(probe, '/es/historias/', '/es/historias/'),
  'ספרדית מי אני': '/es/sobre-mi/',
};
await probe.context().close();

for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w > 800 ? 900 : 844 } });
  for (const [name, url] of Object.entries(pages)) {
    if (!url) { log(w, name, 'לא נמצא קישור לעמוד מייצג'); continue; }
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error' && !IGNORED.some((r) => r.test(m.text() + (m.location().url || '')))) errs.push(m.text());
    });
    const res = await page.goto(BASE + url, { waitUntil: 'networkidle' });
    if (res.status() !== 200) log(w, name, `סטטוס ${res.status()}`);
    // גלילה כדי שתמונות עצלות יטענו לפני בדיקת תמונות שבורות
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(300);
    const m = await page.evaluate(() => {
      const vis = (el) => el && el.getBoundingClientRect().width > 0 && getComputedStyle(el).visibility !== 'hidden';
      const h1 = document.querySelector('h1');
      const hr = h1 && h1.getBoundingClientRect();
      const main = document.querySelector('main');
      const hdr = document.querySelector('.site-header');
      const nav = hdr && hdr.querySelector('.site-nav:not(.site-nav-desk), .site-nav-desk');
      const menu = hdr && hdr.querySelector('.menu-btn');
      const navVisible = [...(hdr ? hdr.querySelectorAll('.site-nav, .site-nav-desk') : [])].some(vis);
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        broken: [...document.images].filter((i) => i.complete && !i.naturalWidth).map((i) => i.currentSrc || i.src),
        h1w: hr ? Math.round(hr.width) : null,
        h1lines: hr ? Math.round(hr.height / parseFloat(getComputedStyle(h1).lineHeight)) : null,
        mainw: main ? Math.round(main.getBoundingClientRect().width) : null,
        navVisible, menuVisible: vis(menu), hasHeader: !!hdr,
        scrollerCut: [...document.querySelectorAll('.rail')].some((r) => getComputedStyle(r).overflowX === 'auto' && r.scrollWidth > r.clientWidth),
      };
    });
    if (m.overflow > 0) log(w, name, `גלישה אופקית ${m.overflow}px`);
    if (errs.length) log(w, name, `שגיאות JS: ${errs.slice(0, 2).join(' | ')}`);
    if (m.broken.length) log(w, name, `תמונות שבורות: ${m.broken.slice(0, 2).join(', ')}`);
    if (m.h1w > 2 && m.mainw && m.h1w < Math.min(m.mainw - 80, 300) && w >= 1280) log(w, name, `כותרת ראשית צרה (${m.h1w}px, ${m.h1lines} שורות)`);
    if (m.h1w > 2 && m.h1lines > 3) log(w, name, `כותרת ראשית ב-${m.h1lines} שורות`);
    if (w >= 1280 && m.hasHeader) {
      if (!m.navVisible) log(w, name, 'ניווט ראשי לא מוצג במחשב');
      if (m.menuVisible) log(w, name, '☰ מוצג במחשב (אמור להיות ניווט מלא)');
      if (m.scrollerCut) log(w, name, 'מדף עם גלילה אופקית חתוכה במחשב');
    }
    const shot = join(OUT, `${name.replace(/\s+/g, '-')}-${w}.png`);
    await page.screenshot({ path: shot, fullPage: true }).catch(() => {});
    await page.close();
  }
  await ctx.close();
}
await browser.close();

console.log(`qa:visual – ${Object.keys(pages).length} עמודים × ${WIDTHS.length} רוחבים (${WIDTHS.join('/')}). צילומים: ${OUT}`);
if (fails.length) {
  console.log(`נמצאו ${fails.length} בעיות:\n- ` + fails.join('\n- '));
  process.exit(1);
}
console.log('הכול תקין.');
