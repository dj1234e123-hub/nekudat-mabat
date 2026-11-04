// מפיק את כרטיס השיתוף הגבוה (card.png, 1080x1920) של רגע, מהטקסט שבריפו,
// בדיוק כמו העמוד card.png באתר. משמש את הסקיל morning-moment: בעל הפרויקט
// מקבל את התמונה כקובץ להורדה, בלי לפתוח את האתר.
//
// שימוש:
//   npm run card -- <slug | קישור לרגע> [עוד...] [--es] [--out תיקייה]
// דוגמאות:
//   npm run card -- ma-shlom-hayeladim
//   npm run card -- https://nekudatmabat.blog/moments/secret/ma-shlom-hayeladim/
//   npm run card -- https://nekudatmabat.blog/es/momentos/secret/ma-shlom-hayeladim/
//
// הפלט: .cards/<slug>.png (או <slug>-es.png). התיקייה מחוץ ל-git.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import yaml from 'js-yaml';

const args = process.argv.slice(2);
let outDir = '.cards';
let forceEs = false;
const targets = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out') outDir = args[++i];
  else if (args[i] === '--es') forceEs = true;
  else targets.push(args[i]);
}
if (!targets.length) {
  console.error('שימוש: npm run card -- <slug | קישור> [--es] [--out תיקייה]');
  process.exit(1);
}

// אורזים את moment-card.ts לקובץ זמני אחד, כדי להריץ את אותו קוד של האתר בלי תלות נוספת.
// בתוך תיקיית הפרויקט, כדי שהקובץ הארוז ימצא את node_modules.
const bundle = path.join('node_modules', '.cache', `moment-card-${process.pid}.mjs`);
await build({
  entryPoints: ['src/lib/moment-card.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  outfile: bundle,
  logLevel: 'error',
});
const { renderMomentStory } = await import(pathToFileURL(bundle).href);

fs.mkdirSync(outDir, { recursive: true });
let failed = false;
for (const t of targets) {
  const es = forceEs || /\/es\/momentos\//.test(t);
  const slug = t.replace(/[?#].*$/, '').replace(/\/+$/, '').split('/').pop();
  const file = path.join(es ? 'src/content/moments-es' : 'src/content/moments', `${slug}.md`);
  if (!fs.existsSync(file)) {
    console.error(`✗ ${slug}: אין קובץ ${file}`);
    failed = true;
    continue;
  }
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const fm = yaml.load(m[1]);
  const png = renderMomentStory(m[2], 'nekudatmabat.blog', fm.title, fm.handle ?? null, es ? 'es' : 'he');
  const out = path.join(outDir, `${slug}${es ? '-es' : ''}.png`);
  fs.writeFileSync(out, png);
  const when = new Date(fm.date);
  const future = when > new Date();
  const il = when.toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem', dateStyle: 'short', timeStyle: 'short' });
  console.log(`✓ ${out} · "${fm.title}" · מתפרסם ${il} שעון ישראל${future ? ' ← עדיין לא באתר!' : ''}`);
}
fs.rmSync(bundle, { force: true });
process.exit(failed ? 1 : 0);
