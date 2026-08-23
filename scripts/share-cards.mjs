// יצירת תמונת שיתוף ממותגת לכל "רגע" (שלב 4.7).
//
// למה סקריפט ידני ולא יצירה בזמן בנייה: הכלי הסטנדרטי ליצירת תמונות בשרת
// (satori) אינו יודע לסדר טקסט מימין לשמאל — הוא מחזיר עברית הפוכה מילה-מילה
// ופיסוק חסר. לכן הרינדור נעשה בדפדפן אמיתי, שמציג עברית בדיוק כמו האתר
// ובאותם קובצי פונט, והתמונות המוכנות נשמרות בריפו. הבנייה בשרת רק מגישה אותן.
//
// הרצה:  npm run cards
// מתי:   אחרי הוספת רגע חדש או שינוי טקסט של רגע קיים.

import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src/content/moments');
const OUT = path.join(ROOT, 'public/share/moments');
const W = 1080;
const H = 1350; // יחס 4:5 — נכנס לסטטוס וואטסאפ בלי חיתוך

const font = (f) =>
  fs.readFileSync(path.join(ROOT, 'public/fonts', f)).toString('base64');

const FONTS = {
  frlHe: font('frank-ruhl-libre-hebrew.woff2'),
  frlLa: font('frank-ruhl-libre-latin.woff2'),
  hbHe: font('heebo-hebrew.woff2'),
  hbLa: font('heebo-latin.woff2'),
};

const HE_RANGE = 'U+0590-05FF,U+FB1D-FB4F,U+200C-2010,U+20AA,U+25CC';
const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// גודל הגופן נגזר מאורך הטקסט: רגע קצר נושם, רגע ארוך עדיין נכנס במלואו.
const fitSize = (n) => (n < 190 ? 50 : n < 280 ? 45 : n < 380 ? 40 : 36);

function cardHtml(paragraphs) {
  const size = fitSize(paragraphs.join(' ').length);
  return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:FRL;font-weight:300 900;src:url(data:font/woff2;base64,${FONTS.frlHe}) format('woff2');unicode-range:${HE_RANGE}}
@font-face{font-family:FRL;font-weight:300 900;src:url(data:font/woff2;base64,${FONTS.frlLa}) format('woff2')}
@font-face{font-family:HB;font-weight:100 900;src:url(data:font/woff2;base64,${FONTS.hbHe}) format('woff2');unicode-range:${HE_RANGE}}
@font-face{font-family:HB;font-weight:100 900;src:url(data:font/woff2;base64,${FONTS.hbLa}) format('woff2')}
*{margin:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;background:#F3E9D3;color:#2E2A24;font-family:FRL,serif;
  display:flex;flex-direction:column;align-items:center;justify-content:space-between;
  padding:92px 88px 68px;-webkit-font-smoothing:antialiased}
.dot{width:15px;height:15px;border-radius:50%;background:#C9A24D;flex:none}
.body{flex:1;display:flex;flex-direction:column;justify-content:center;
  gap:${Math.round(size * 0.82)}px;padding:44px 0}
.body p{font-size:${size}px;line-height:1.7;text-align:center;text-wrap:balance}
.sign{display:flex;flex-direction:column;align-items:center;flex:none}
.rule{width:70px;height:2px;background:#C9A24D;opacity:.5;margin-bottom:26px}
.name{font-family:HB,sans-serif;font-weight:600;font-size:29px;color:#17453F;letter-spacing:.01em}
.url{font-family:HB,sans-serif;font-size:22px;color:#75695A;margin-top:11px;direction:ltr}
</style></head><body>
<span class="dot"></span>
<div class="body">${paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</div>
<div class="sign"><span class="rule"></span>
<span class="name">נקודת מבט · אפרים עטיה</span>
<span class="url">nekudatmabat.blog</span></div>
</body></html>`;
}

// גוף הרגע בלבד, מחולק לפסקאות — בלי ה-frontmatter.
const paragraphsOf = (file) =>
  fs
    .readFileSync(path.join(SRC, file), 'utf8')
    .split('---')[2]
    .trim()
    .split('\n\n')
    .map((s) => s.trim())
    .filter(Boolean);

const chromePath = () => {
  const dir = fs
    .readdirSync('/opt/pw-browsers')
    .find((d) => d.startsWith('chromium-'));
  return `/opt/pw-browsers/${dir}/chrome-linux/chrome`;
};

fs.mkdirSync(OUT, { recursive: true });
const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.md'));

const browser = await chromium.launch({ executablePath: chromePath() });
const page = await browser.newPage({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
});

for (const file of files) {
  const id = file.replace(/\.md$/, '');
  await page.setContent(cardHtml(paragraphsOf(file)), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(OUT, `${id}.png`) });
}

await browser.close();
console.log(`נוצרו ${files.length} תמונות שיתוף ב-public/share/moments/`);
