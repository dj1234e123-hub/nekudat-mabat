// Fonts and images come from the site itself, so a video always looks like the site.
import fs from 'node:fs';
const files = {
  'frank.ttf': '../src/assets/og-fonts/frank.ttf',
  'frank-bold.ttf': '../src/assets/og-fonts/frank-bold.ttf',
  'heebo.ttf': '../src/assets/og-fonts/heebo.ttf',
  'heebo-bold.ttf': '../src/assets/og-fonts/heebo-bold.ttf',
  'logo.jpg': '../src/assets/logo.jpg',
  'lama-korim-li-efraim.png': '../src/assets/covers/lama-korim-li-efraim.png',
  'chacham-efraim-hacohen.png': '../src/assets/photos/chacham-efraim-hacohen.png',
};
fs.mkdirSync('public', { recursive: true });
for (const [to, from] of Object.entries(files)) fs.copyFileSync(from, `public/${to}`);
console.log('copied', Object.keys(files).length, 'assets');
