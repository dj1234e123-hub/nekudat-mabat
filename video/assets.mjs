// Fonts and images come from the site itself, so a video always looks like the site.
import fs from 'node:fs';
import { createRequire } from 'node:module';

const sharp = createRequire(new URL('../package.json', import.meta.url))('sharp');

const files = {
  'frank.ttf': '../src/assets/og-fonts/frank.ttf',
  'frank-bold.ttf': '../src/assets/og-fonts/frank-bold.ttf',
  'heebo.ttf': '../src/assets/og-fonts/heebo.ttf',
  'heebo-bold.ttf': '../src/assets/og-fonts/heebo-bold.ttf',
  'logo.jpg': '../src/assets/logo.jpg',
  'playpen-hebrew.woff2': '../public/fonts/playpen-hebrew.woff2',
  'lama-korim-li-efraim.png': '../src/assets/covers/lama-korim-li-efraim.png',
  'chacham-efraim-hacohen.png': '../src/assets/photos/chacham-efraim-hacohen.png',
};
fs.mkdirSync('public/wall', { recursive: true });
for (const [to, from] of Object.entries(files)) fs.copyFileSync(from, `public/${to}`);

// The promo's wall: the cover of every published story, small enough to move 30 at a time.
// "Published" is what the last site build produced, so a held story never leaks into a video.
const published = fs.readdirSync('../dist/stories');
const covers = fs.readdirSync('../src/assets/covers')
  .filter((f) => f.endsWith('.png') && !f.startsWith('default') && !f.endsWith('-es.png'))
  .filter((f) => { const b = f.replace('.png', ''); return published.some((s) => s === b || s.startsWith(`${b}-`)); });
await Promise.all(covers.map((f) =>
  sharp(`../src/assets/covers/${f}`).resize(420).jpeg({ quality: 78 }).toFile(`public/wall/${f.replace('.png', '.jpg')}`)));
fs.writeFileSync('src/wall.json', JSON.stringify(covers.map((f) => `wall/${f.replace('.png', '.jpg')}`)));

// Gate photos: the four story worlds and the five moment gates.
const gates = ['stories-red', 'stories-teal', 'stories-blue', 'stories-gold', 'hurting', 'self', 'stuck', 'beginning', 'upward'];
await Promise.all(gates.map((g) => {
  const src = ['png', 'jpg'].map((e) => `../src/assets/gates/${g}.${e}`).find((p) => fs.existsSync(p));
  return sharp(src).resize(700).jpeg({ quality: 82 }).toFile(`public/gate-${g}.jpg`);
}));

console.log('assets:', Object.keys(files).length, 'files ·', covers.length, 'covers ·', gates.length, 'gates');
