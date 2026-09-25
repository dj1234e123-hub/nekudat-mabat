// בדיקת הפורמט של "רגע של נקודת מבט" – docs/MOMENT-FORMAT.md
//
// הרעיון: הכללים חדלים להיות תלויים בזיכרון של מי שכותב. רגע שייכתב בעוד
// חצי שנה ייבדק מול אותם כללים בדיוק.
//
// שלוש רמות, ובכוונה:
//   PASS    – עומד בטווח היעד.
//   WARNING – חריגה קטנה. דורשת עין, **לא** דורשת תיקון. רגע טוב לא משתנה
//             רק כדי לקבל PASS; אם החריגה משרתת את הרגע, היא נשארת.
//   FAIL    – הפרה מהותית של המנגנון עצמו, ולא של מספר.
//
// הסקריפט בודק רק את מה שאפשר לספור. **התנועה, השפה והגילוי נבדקים בקריאה
// ולא כאן** – סקריפט לא יודע אם הקורא אמר "זה אני".
//
// הרצה:  npm run check:moments
import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';

const DIR = 'src/content/moments';

/* ─── טווחי היעד ───────────────────────────────────────────────────────── */
const T = {
  titleWords: [2, 4],
  moves: 3,
  linesPerMove: [3, 5],
  bodyLines: [12, 14],
  wordsPerLine: [2, 5],
  closingLines: [2, 3],
};

/** כינויים שכמעט תמיד מצביעים אל מחוץ למשפט שהם יושבים בו */
const OUTWARD = /(^|\s)(בו|בה|אותו|אותה|אותם|אותן|הזה|הזאת|הללו)(\s|$|[.,!?])/;
/** פתיחה בכינוי – אין לו על מה להישען, כי אין עדיין שם עצם לפניו */
const OPENS_WITH_PRONOUN = /^(זה|זו|הוא|היא|הם|הן|שם)\b/;
/** מילות תפנית מקובלות. לא חובה – רק נמדד */
const TURN = /^(אבל|אך|ואולי|אולי|רק|ובכל זאת|ודווקא|ואם)/;
/** מילות עצירה שלא נחשבות "מילה מהכותרת שחוזרת בגוף" */
const STOP = new Set(['זה', 'זו', 'לא', 'מה', 'מי', 'את', 'של', 'על', 'כבר', 'הוא', 'היא', 'יש', 'אין']);

/* ─── עזר ─────────────────────────────────────────────────────────────── */
const words = (s) => s.replace(/\*\*/g, '').split(/\s+/).filter(Boolean);
/** מילה בלי פיסוק נדבק – "עצלות." ו"עצלות" הן אותה מילה */
const bare = (w) => w.replace(/^[^\u0590-\u05FFa-zA-Z0-9]+|[^\u0590-\u05FFa-zA-Z0-9]+$/g, '');
/** אות סופית לצורתה הרגילה */
const unfinal = (w) => w.replace(/[ךםןףץ]$/, (c) => 'כמנפצ'['ךםןףץ'.indexOf(c)]);

/**
 * הצורות האפשריות של מילה – עם אות שימוש בראש ובלעדיה.
 *
 * מחזיר **קבוצה** ולא שורש יחיד, כי שורש יחיד טועה: "מקום" מתחיל ב-מ',
 * והמסיר-אות-שימוש חתך אותה והפך אותו ל"קום" – כך ש"המקום" בכותרת
 * ו"מקום" בגוף נראו כשתי מילים שונות, והכלל הכשיל טקסט תקין.
 * השוואה בין קבוצות מוצאת התאמה בלי לנחש מה קידומת ומה חלק מהמילה.
 */
const forms = (w) => {
  const b = unfinal(bare(w));
  const set = new Set([b]);
  if (b.length > 3 && /^[הוכלבשמ]/.test(b)) set.add(b.slice(1));
  return set;
};

/** שדה frontmatter שיכול להיות שורה אחת או בלוק (|- / |) של כמה שורות. */
function blockField(fm, key) {
  const lines = fm.split('\n');
  const i = lines.findIndex((l) => l.startsWith(`${key}:`));
  if (i === -1) return null;
  const inline = lines[i].slice(key.length + 1).trim();
  if (!/^[|>][-+]?$/.test(inline)) return inline ? [inline.replace(/^["']|["']$/g, '')] : null;
  const out = [];
  for (const l of lines.slice(i + 1)) {
    if (!/^\s+\S/.test(l)) break;
    out.push(l.trim());
  }
  return out.length ? out : null;
}

function parse(file) {
  const raw = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const [, fm, body] = m;
  const field = (k) => (fm.match(new RegExp(`^${k}:\\s*(.+)$`, 'm')) || [])[1]?.trim();

  const lines = body.trim().split('\n');
  const mark = lines.findIndex((l) => /^-{3,}$/.test(l.trim()));
  const head = mark === -1 ? lines : lines.slice(0, mark);
  const tail = mark === -1 ? [] : lines.slice(mark + 1);

  const toBlocks = (ls) => {
    const out = [];
    let cur = [];
    for (const l of ls) {
      if (l.trim()) cur.push(l.trim());
      else if (cur.length) (out.push(cur), (cur = []));
    }
    if (cur.length) out.push(cur);
    return out;
  };

  return {
    id: path.basename(file, '.md'),
    feeling: field('feeling'),
    title: field('title') || null,
    handle: blockField(fm, 'handle'),
    moves: toBlocks(head),
    closing: toBlocks(tail).flat(),
    hasMark: mark !== -1,
  };
}

/* ─── הכללים ──────────────────────────────────────────────────────────── */
function check(m) {
  const r = [];
  const add = (level, rule, detail) => r.push({ level, rule, detail });
  const range = (value, [lo, hi], rule, unit, slack = 1) => {
    if (value >= lo && value <= hi) add('PASS', rule, `${value} ${unit}`);
    else if (value >= lo - slack && value <= hi + slack)
      add('WARNING', rule, `${value} ${unit} (היעד ${lo}–${hi})`);
    else add('FAIL', rule, `${value} ${unit} (היעד ${lo}–${hi})`);
  };

  // 1 · כותרת
  const tw = words(m.title).length;
  range(tw, T.titleWords, 'אורך הכותרת', 'מילים');

  // 2 · מילה מהכותרת חיה בגוף – ולא רק בסיום
  const bodyForms = new Set(m.moves.flat().flatMap((l) => words(l).flatMap((w) => [...forms(w)])));
  const titleWords = words(m.title).filter((w) => !STOP.has(bare(w)) && bare(w).length > 2);
  const rooted = titleWords.filter((w) => [...forms(w)].some((f) => bodyForms.has(f)));
  if (!titleWords.length) add('WARNING', 'הכותרת מושרשת בגוף', 'הכותרת כולה מילות עצירה');
  else if (rooted.length) add('PASS', 'הכותרת מושרשת בגוף', `"${rooted.join('", "')}"`);
  else add('FAIL', 'הכותרת מושרשת בגוף', `אף מילה מהכותרת אינה בגוף (${titleWords.join(', ')})`);

  // 3 · שלושה מהלכים
  if (m.moves.length === T.moves) add('PASS', 'מספר המהלכים', '3');
  else if (Math.abs(m.moves.length - T.moves) === 1)
    add('WARNING', 'מספר המהלכים', `${m.moves.length} (היעד 3)`);
  else add('FAIL', 'מספר המהלכים', `${m.moves.length} (היעד 3)`);

  // 4 · שורות בכל מהלך
  const lens = m.moves.map((s) => s.length);
  lens.forEach((n, i) => range(n, T.linesPerMove, `שורות במהלך ${i + 1}`, 'שורות'));

  // 5 · איזון בין המהלכים
  const spread = lens.length ? Math.max(...lens) - Math.min(...lens) : 0;
  if (spread <= 1) add('PASS', 'איזון המהלכים', `הפרש ${spread}`);
  else if (spread === 2) add('WARNING', 'איזון המהלכים', `הפרש ${spread} שורות`);
  else add('FAIL', 'איזון המהלכים', `הפרש ${spread} שורות`);

  // 6 · אורך הגוף
  range(lens.reduce((a, b) => a + b, 0), T.bodyLines, 'שורות בגוף', 'שורות', 2);

  // 7 · מילים בשורה
  const long = m.moves.flat().filter((l) => words(l).length > T.wordsPerLine[1]);
  const veryLong = long.filter((l) => words(l).length >= 8);
  if (veryLong.length) add('FAIL', 'אורך השורה', `${veryLong.length} שורות בנות 8+ מילים – זו פסקה, לא שורה`);
  else if (long.length) add('WARNING', 'אורך השורה', `${long.length} שורות חורגות מ-5 מילים`);
  else add('PASS', 'אורך השורה', 'הכול בטווח');

  // 8 · סימן הסיום
  if (!m.closing.length) add('FAIL', 'קיום הסיום', 'אין סיום');
  else {
    if (!m.hasMark) add('WARNING', 'סימן הסיום', 'חסר "---" – הסיום נגזר מהמהלך האחרון');
    range(m.closing.length, T.closingLines, 'שורות בסיום', 'שורות');

    // 9 · הסיום קצר מהמהלך הראשון
    const cw = m.closing.flatMap(words).length;
    const fw = (m.moves[0] || []).flatMap(words).length;
    if (cw < fw) add('PASS', 'הסיום קצר מהפתיחה', `${cw} מול ${fw} מילים`);
    else if (cw === fw) add('WARNING', 'הסיום קצר מהפתיחה', `שווים (${cw})`);
    else add('FAIL', 'הסיום קצר מהפתיחה', `${cw} מול ${fw} מילים – הסיום ארוך יותר`);

    // 10 · הסיום עומד לבדו
    const text = m.closing.join(' ');
    const out = text.match(OUTWARD);
    if (out) add('FAIL', 'הסיום עומד לבדו', `כינוי מצביע: "${out[2]}"`);
    else if (OPENS_WITH_PRONOUN.test(text)) add('FAIL', 'הסיום עומד לבדו', 'נפתח בכינוי בלי עוגן');
    else add('PASS', 'הסיום עומד לבדו', 'בלי כינוי מצביע');
  }

  // 11 · לשון כללית בסיבוב
  // הכשל הזה חזר פעמיים: "אף אחד לא נשאר במקום בלי סיבה" בפיילוט, ו"מי
  // שמשוכנע שהוא כלום מחפש הקלה" בסבב הראשון. שניהם תקינים כמשפט, ושניהם
  // מעבירים את הרגע מגילוי על הקורא לחוק על בני האדם – וברגע שמכריזים חוק,
  // הקורא מפסיק להיות בפנים והופך למי שמסבירים לו.
  // WARNING ולא FAIL: לשון חלקית ("יש לבבות ש...") לגיטימית ומופיעה במקור.
  // הרשימה צומצמה אחרי שהמדף "בדידות" הפיל שלוש התרעות שגויות: שם "אנשים"
  // ו"כולם" הם הנושא עצמו ולא חוק. נשארו רק סימני ההכללה הגורפת האמיתיים.
  // "יש אנשים ש..." נשאר מחוץ לרשימה בכוונה – זו לשון חלקית, והיא מופיעה
  // בכרטיסים המקוריים ("יש לבבות שהתרגלו להילחם בעצמם").
  const SWEEPING = /(אף אחד|כל אדם|אין אדם|אף פעם|לעולם לא|בני אדם)/;
  const OPENS_GENERAL = /^(אבל )?מי ש/;
  const flagged = m.moves
    .map((s, i) => ({ i: i + 1, text: s.join(' ') }))
    .filter((x) => SWEEPING.test(x.text) || OPENS_GENERAL.test(x.text));
  if (flagged.length)
    add('WARNING', 'לשון כללית', `מהלך ${flagged.map((x) => x.i).join(', ')} – לוודא שזה גילוי על הקורא ולא חוק על בני אדם`);
  else add('PASS', 'לשון כללית', 'מדבר על הקורא');

  // 12 · הדגשות
  const bolds = m.moves.map((s) => (s.join(' ').match(/\*\*[^*]+\*\*/g) || []).length);
  if (bolds.every((n) => n === 1)) add('PASS', 'הדגשה לכל מהלך', '1 בכל מהלך');
  else add('WARNING', 'הדגשה לכל מהלך', `[${bolds.join(', ')}] (היעד 1 בכל מהלך)`);
  if (/\*\*/.test(m.closing.join(' ')))
    add('WARNING', 'בלי הדגשה בסיום', 'הסיום כבר מודגש וצבוע – הדגשה בתוכו אינה נראית');
  else add('PASS', 'בלי הדגשה בסיום', 'נקי');

  // 13 · נקודה לדרך — חובה מאז שכל 109 קיבלו אותה (2026-09-25), כמו title.
  // הכרטיס הגבוה מפנה לה שתי שורות בדיוק: שלוש שורות שוברות את הפריסה → FAIL.
  // האורך נבדק בתווים ולא רק במילים, כי מה שנשבר בכרטיס הוא הרוחב.
  if (m.handle) {
    const hl = m.handle;
    const ht = hl.join(' ');
    if (hl.length > 2) add('FAIL', 'נקודה לדרך · שורות', `${hl.length} שורות (עד 2 — הכרטיס מפנה בדיוק שתיים)`);
    else add('PASS', 'נקודה לדרך · שורות', `${hl.length}`);
    const long = hl.filter((l) => l.length > 34);
    if (long.length) add('WARNING', 'נקודה לדרך · רוחב', `שורה של ${Math.max(...long.map((l) => l.length))} תווים (עד ~34, אחרת נשברת לבד)`);
    const hw = words(ht).length;
    if (hw > 12) add('WARNING', 'נקודה לדרך · אורך', `${hw} מילים (עד ~12)`);
    else add('PASS', 'נקודה לדרך · אורך', `${hw} מילים`);
    // לשון מותרת ולא מצווה, ולשני המינים — אותם כללים של הרגע עצמו.
    const command = ht.match(/(^|\s)(צריך|צריכה|כדאי|חייב|חייבת|תעשה|תנסה|אתה)(\s|$|[.,!?])/);
    if (command) add('FAIL', 'נקודה לדרך · לשון', `"${command[2]}" — ציווי או פנייה ממוגדרת`);
    else add('PASS', 'נקודה לדרך · לשון', 'מותרת ולא מצווה');
    // הידית נגזרת מהסיבוב ולא ממציאה עצה חדשה: היא אמורה להיאחז במילה
    // מהמהלך השלישי או מהסיום. WARNING ולא FAIL — הקשר יכול להיות במשמעות.
    // אותיות שימוש ("הלילה"/"לילה", "לטוב"/"טוב") לא מבטלות אחיזה — אותה השוואה של כלל 2.
    const keep = (f) => f.length > 2 && !STOP.has(f);
    const source = new Set(words([...(m.moves[2] || []), ...m.closing].join(' ')).flatMap((w) => [...forms(w)]).filter(keep));
    const shared = words(ht).filter((w) => [...forms(w)].some((f) => keep(f) && source.has(f))).map(bare);
    if (shared.length) add('PASS', 'נקודה לדרך · נאחזת בסיבוב', shared.join(', '));
    else add('WARNING', 'נקודה לדרך · נאחזת בסיבוב', 'אין מילה משותפת עם הסיבוב או הסיום');
  } else add('FAIL', 'נקודה לדרך', 'חסרה – כל רגע נחתם בשורה לדרך');

  return r;
}

/* ─── רגע שטרם הוגר: מה העבודה שמחכה לו ────────────────────────────────── */
function survey(m) {
  const paras = m.moves;
  const last = paras[paras.length - 1] || [];
  const first = paras[0] || [];
  const lastW = last.flatMap(words).length;
  const firstW = first.flatMap(words).length;
  const total = paras.flat().flatMap(words).length;
  const needs = [];
  needs.push('כותרת'); // תמיד – אין אף כותרת במלאי
  if (!paras.slice(1).some((p) => TURN.test(p[0]))) needs.push('סיבוב מסומן');
  if (lastW >= firstW) needs.push('סיום מקוצר');
  const t = last.join(' ');
  if (OUTWARD.test(t) || OPENS_WITH_PRONOUN.test(t)) needs.push('סיום עצמאי');
  if (total > 50) needs.push('הידוק');
  if (paras.length !== 4) needs.push(`מבנה (${paras.length} פסקאות)`);
  return { needs, total, paras: paras.length };
}

/* ─── הרצה ────────────────────────────────────────────────────────────── */
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.md')).map((f) => path.join(DIR, f));
const all = files.map(parse).filter(Boolean);
const migrated = all.filter((m) => m.title);
const pending = all.filter((m) => !m.title);

const ICON = { PASS: '✓', WARNING: '▲', FAIL: '✗' };
let fails = 0;
let warns = 0;

console.log(`\n══ בדיקת פורמט הרגעים ══  ${all.length} רגעים · ${migrated.length} הוגרו · ${pending.length} ממתינים\n`);

if (migrated.length) {
  console.log('── רגעים בפורמט החדש ──\n');
  for (const m of migrated) {
    const res = check(m);
    const f = res.filter((x) => x.level === 'FAIL');
    const w = res.filter((x) => x.level === 'WARNING');
    fails += f.length;
    warns += w.length;
    const verdict = f.length ? 'FAIL' : w.length ? 'WARNING' : 'PASS';
    console.log(`${ICON[verdict]} ${m.id}  ·  "${m.title}"  ·  ${m.feeling}`);
    for (const x of res) {
      if (x.level === 'PASS' && !process.argv.includes('--all')) continue;
      console.log(`    ${ICON[x.level]} ${x.rule}: ${x.detail}`);
    }
    if (verdict === 'PASS') console.log('    כל הכללים המכניים עומדים בטווח.');
    console.log();
  }

  // בדיקת מכלול: נוסחה אינה נראית בפריט בודד, רק בערימה
  if (migrated.length > 2) {
    console.log('── בדיקת מכלול (נוסחתיות) ──');
    const frame = (s) => words(s).slice(0, 2).join(' ');
    const count = (arr) => arr.reduce((a, k) => ((a[k] = (a[k] || 0) + 1), a), {});
    for (const [label, list] of [
      ['פתיחות כותרת', migrated.map((m) => frame(m.title))],
      ['פתיחות סיום', migrated.map((m) => frame(m.closing.join(' ')))],
      // פתיחת המהלך הראשון היא מה שמוצג במדף, ולכן שתי פתיחות דומות
      // נראות זו לצד זו. נמצא בפועל בסבב "חוסר שליטה".
      ['פתיחות המהלך הראשון', migrated.map((m) => frame((m.moves[0] || []).join(' ')))],
    ]) {
      const rep = Object.entries(count(list)).filter(([, n]) => n > 2);
      if (rep.length) {
        warns += rep.length;
        console.log(`  ▲ ${label}: ${rep.map(([k, n]) => `"${k}" ×${n}`).join(', ')} – נוסחה`);
      } else console.log(`  ✓ ${label}: מגוונות`);
    }
    console.log();
  }
}

console.log('── ממתינים להגירה: מה העבודה ──\n');
const byFeeling = {};
for (const m of pending) (byFeeling[m.feeling] ||= []).push(m);
const rows = Object.entries(byFeeling)
  .map(([feeling, ms]) => {
    const s = ms.map(survey);
    return { feeling, ms, s, score: s.reduce((a, x) => a + x.needs.length, 0) / ms.length };
  })
  .sort((a, b) => a.score - b.score);

for (const { feeling, ms, s, score } of rows) {
  console.log(`${feeling}  ·  ${ms.length} רגעים  ·  ציון עבודה ${score.toFixed(1)}`);
  ms.forEach((m, i) => console.log(`    ${m.id}  (${s[i].total} מילים)  →  ${s[i].needs.join(' · ')}`));
  console.log();
}

const tally = {};
for (const m of pending) for (const n of survey(m).needs) tally[n] = (tally[n] || 0) + 1;
console.log('── סיכום העבודה שמחכה ──');
for (const [k, v] of Object.entries(tally).sort((a, b) => b[1] - a[1]))
  console.log(`  ${String(v).padStart(3)} רגעים צריכים: ${k}`);

/* ─── "Para el camino" בספרדית ─────────────────────────────────────────
   בדיקה מכנית בסיסית בלבד – שורות, רוחב בכרטיס ולשון. הניסוח עצמו נבדק
   בקריאה (docs/SPANISH-EDITORIAL-GUIDELINES.md). הרוחב נמדד בפונט הכרטיס,
   בגודל השורה בכרטיס (50), מול רוחב הטקסט המותר (844) – כמו moment-card.ts. */
const ES_DIR = 'src/content/moments-es';
const CARD_FONT = (() => {
  const b = fs.readFileSync('src/assets/og-fonts/frank.ttf');
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
})();
const cardWidth = (t) => {
  let w = 0;
  for (const c of t) w += (CARD_FONT.charToGlyph(c).advanceWidth ?? 0) * (50 / CARD_FONT.unitsPerEm);
  return w;
};
const ES_COMMAND = /\b(debes|deberías|tienes que|hay que|necesitas|intenta|haz|no dejes)\b/i;
const esFiles = fs.readdirSync(ES_DIR).filter((f) => f.endsWith('.md'));
const esProblems = [];
for (const f of esFiles) {
  const text = fs.readFileSync(path.join(ES_DIR, f), 'utf8');
  const fm = text.split(/^---\s*$/m)[1] ?? '';
  const hl = blockField(fm, 'handle');
  const id = path.basename(f, '.md');
  if (!hl) { esProblems.push(['FAIL', id, 'חסרה']); continue; }
  if (hl.length > 2) esProblems.push(['FAIL', id, `${hl.length} שורות (עד 2)`]);
  for (const l of hl) if (cardWidth(l) > 844) esProblems.push(['FAIL', id, `"${l}" רחבה מהכרטיס (${Math.round(cardWidth(l))}/844)`]);
  const cmd = hl.join(' ').match(ES_COMMAND);
  if (cmd) esProblems.push(['FAIL', id, `"${cmd[1]}" – ציווי`]);
}
console.log(`\n── Para el camino · ${esFiles.length} רגעים בספרדית ──`);
if (esProblems.length) for (const [lvl, id, d] of esProblems) console.log(`  ${ICON[lvl]} ${id}: ${d}`);
else console.log('  ✓ לכולם שורה לדרך, עד שתי שורות, נכנסת לכרטיס, בלי ציווי');
fails += esProblems.filter(([lvl]) => lvl === 'FAIL').length;

console.log(`\n══ ${fails} FAIL · ${warns} WARNING · ${pending.length} טרם הוגרו ══\n`);
process.exit(fails ? 1 : 0);
