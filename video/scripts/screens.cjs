// Screenshots of the real site for the promo's phone. Needs a built site served on :4321
// (npx serve -l 4321 ../dist) and Playwright.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  for (const [url, name] of [['/', 'site-home'], ['/stories/', 'site-stories']]) {
    await p.goto('http://localhost:4321' + url, { waitUntil: 'networkidle' });
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); });
    await p.waitForTimeout(500);
    await p.screenshot({ path: `public/${name}.png`, fullPage: true });
  }
  await b.close();
})();
