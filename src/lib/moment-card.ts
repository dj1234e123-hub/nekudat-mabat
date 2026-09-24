// יצירת תמונת השיתוף של "רגע" — נוצרת בזמן הבנייה, מהטקסט עצמו.
//
// התמונה נושאת את אותם ארבעת השלבים של הרגע (docs/MOMENT-FORMAT.md):
// כותרת → המציאות → המסקנה → הסיבוב → קישוט → סיום מובלט.
//
// מה נשאר מההחלטות הקודמות: רקע שמנת, נקודת זהב אחת למעלה, בתחתית קו זהב קצר,
// החתימה וכתובת האתר. בלי סמל העין, בלי דמויות, בלי צילומים — ובלי שם המצב,
// שהיה מתייג את מי שמשתף.
//
// 1080x1350 (יחס 4:5): התמונה נועדה בראש ובראשונה לסטטוס וואטסאפ, ושם
// פורמט רוחבי נחתך.
//
// למה resvg ולא satori: satori אינו מיישם את אלגוריתם ה-bidi, ולכן עברית
// יוצאת ממנו הפוכה מילה-מילה. resvg מעצב דרך rustybuzz, עם bidi מלא.
// למה בזמן בנייה ולא כקבצים מוכנים בריפו: כשהטקסט משתנה התמונה מתעדכנת מעצמה.
//
// הפונטים כאן אינם קובצי האתר: תת-הקבוצה העברית ב-public/fonts אינה מכילה
// סימני פיסוק כלל, ולכן נבנו קבצים ייעודיים שממזגים עברית + לטינית, בגרסה
// סטטית (הגרסה המשתנה מכשילה את מנתחי הפונטים).
import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';
import { Resvg } from '@resvg/resvg-js';
import { parseMoment, plain, type MomentFormat } from './moment-format';

export const WIDTH = 1080;
export const HEIGHT = 1350;
const CENTER = WIDTH / 2;
const MARGIN = 118;
const MAX_TEXT_WIDTH = WIDTH - MARGIN * 2;

/** התחום שבו הטקסט חי — בין נקודת הזהב לקו התחתון */
const TEXT_TOP = 160;
const TEXT_BOTTOM = 1110;

const DOT_Y = 99;
const DOT_R = 7.5;
const RULE_Y = 1169;
const RULE_HALF = 35;
const SIGN_Y = 1232;
const URL_Y = 1272;
/** הכרטיס העברי נושא שורת קבוצה עדינה, ולכן התחתית שלו נדחסת מעט אחרת */
const HE_SIGN_Y = 1224;
const HE_GROUP_Y = 1266;
const HE_URL_Y = 1304;

const PAPER = '#f3e9d3';
const INK = '#2e2a24';
const MUTED = '#75695a';
const GOLD = '#c9a24d';
const TEAL_DEEP = '#17453f';
const BLUE = '#003b5c';
const BRICK = '#b0463b';

const REGULAR = 'Frank Ruhl Libre';
const BOLD = 'Frank Ruhl Libre Bold';

// מבוסס על תיקיית הפרויקט ולא על import.meta.url: הקוד הזה רץ אחרי האריזה,
// מתוך dist/, ושם הנתיב היחסי כבר לא מצביע על קובצי המקור.
const fontPath = (name: string) => path.resolve(process.cwd(), 'src/assets/og-fonts', `${name}.ttf`);
const FONT_FILES = ['frank', 'frank-bold', 'heebo', 'heebo-bold'].map(fontPath);

/** נטען פעם אחת לכל הבנייה — 66 תמונות מאותם קבצים. */
function load(name: string) {
  const buffer = fs.readFileSync(fontPath(name));
  return opentype.parse(
    buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
  );
}
const FONTS: Record<string, opentype.Font> = {
  [REGULAR]: load('frank'),
  [BOLD]: load('frank-bold'),
};

/**
 * רוחב הטקסט בפיקסלים בגודל נתון, לפי טבלת הרוחבים של הפונט עצמו.
 * מסכם תו-תו במקום getAdvanceWidth: הפונקציה ההיא מפעילה את מנוע העיצוב של
 * opentype.js, שקורס על טקסט עברי. כאן דרוש רק רוחב — לשבירת שורות בלבד;
 * את העיצוב האמיתי עושה resvg.
 */
function measure(text: string, size: number, family = REGULAR): number {
  const font = FONTS[family];
  const scale = size / font.unitsPerEm;
  let width = 0;
  for (const char of text) {
    width += (font.charToGlyph(char).advanceWidth ?? 0) * scale;
  }
  return width;
}

/** שבירת טקסט לשורות שנכנסות לרוחב, מילה שלמה בכל פעם */
function wrap(text: string, size: number, family = REGULAR): string[] {
  const lines: string[] = [];
  let current = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && measure(plain(candidate), size, family) > MAX_TEXT_WIDTH) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);

  // שורה לא מתחילה בסימן פיסוק. הפיסוק ניטרלי מבחינת כיווניות, ובתחילת שורה
  // הוא נוחת בצד הלא נכון וגם קוטע את הקריאה; הוא חוזר לשורה שלפניו.
  for (let i = 1; i < lines.length; i += 1) {
    const match = lines[i].match(/^([—–\-,.:;!?]+)\s+/);
    if (match) {
      lines[i - 1] += ` ${match[1]}`;
      lines[i] = lines[i].slice(match[0].length);
    }
  }
  // מילה בודדת שנשארה לבדה בשורה אחרונה נראית כמו טעות. מושכים אליה מילה
  // מהשורה שמעליה, כל עוד שתיהן עדיין נכנסות.
  if (lines.length > 1) {
    const last = lines[lines.length - 1];
    const previous = lines[lines.length - 2].split(' ');
    if (measure(plain(last), size, family) < MAX_TEXT_WIDTH * 0.3 && previous.length > 2) {
      const moved = previous.pop() as string;
      const balanced = `${moved} ${last}`;
      if (measure(plain(balanced), size, family) <= MAX_TEXT_WIDTH) {
        lines[lines.length - 2] = previous.join(' ');
        lines[lines.length - 1] = balanced;
      }
    }
  }

  return lines.filter(Boolean);
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * RLO (U+202E) … PDF (U+202C): תווי כיווניות בלתי-נראים, לא סימני פיסוק.
 * בלעדיהם resvg ממקם תווים ניטרליים (פיסוק, גרשיים) בקצה ה*לא* נכון של
 * שורה עברית ממורכזת — ולפעמים אף הופך שניים כאלה זה ביחס לזה — במיוחד
 * כשיש יותר מאשכול ניטרלי אחד בשורה (למשל גרש פותח וגרש+נקודה סוגרים).
 * נבדק ואומת ישירות בפיקסלים של ה-PNG שנוצר, לא רק בקוד. RLO כופה סדר
 * תצוגה נכון (override) על פני כל אלגוריתם ניחוש; PDF סוגר את התחום.
 * עוטף את כל השורה — כולל דרך tspan של הדגשה — כי resvg מעצב את כל
 * אלמנט הטקסט כיחידה אחת. לא נוגע בתו אחד מהטקסט הנראה.
 */
const RLO = '‮';
const PDF = '‬';

/**
 * שורה אחת → תוכן של <text>, עם ההדגשות כ-tspan בגופן הכבד.
 * resvg מעצב את כל אלמנט הטקסט כיחידה אחת, ולכן ה-bidi נשמר גם כשיש בתוכו
 * כמה גופנים — וזה מה שמאפשר להדגיש מילה בתוך שורה עברית.
 *
 * עטיפת ה-RLO היא תיקון לשורה עברית בלבד: בשורה לטינית (ספרדית) היא הייתה
 * הופכת את הטקסט כולו, ושם הכיווניות ממילא חד-משמעית — לכן rtl=false מדלג.
 */
function inline(line: string, rtl: boolean): string {
  const body = line
    .split(/(\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('**') && part.endsWith('**')
        ? `<tspan font-family="${BOLD}">${escape(part.slice(2, -2))}</tspan>`
        : escape(part)
    )
    .join('');
  return rtl ? `${RLO}${body}${PDF}` : body;
}

/** פריט מוכן לציור, עם מיקום אנכי מוחלט */
type Item =
  | { kind: 'line'; text: string; size: number; family: string; fill: string; baseline: number }
  | { kind: 'ornament' }
  | { kind: 'title-rule' };

/** פריט עם הגובה שהוא תופס בפריסה */
type Placed = { item: Item; h: number };

/** מפרט הפורמט החדש, ביחסים לגודל הבסיס — כדי שהכול יתכווץ יחד */
const TITLE_RATIO = 1.66;
const CLOSING_RATIO = 1.38;
const LINE_RATIO = 1.52;
const FLOW_LINE_RATIO = 1.78;
const STANZA_GAP_RATIO = 1.0;
/** המרווח של התצוגה הישנה, נשמר כפי שהיה כדי שכרטיס שטרם הוגר לא ישתנה */
const FLOW_GAP_RATIO = 0.87;
const TITLE_RULE_GAP = 0.8;
const TITLE_GAP_RATIO = 1.7;
const ORNAMENT_GAP_RATIO = 1.45;

/**
 * גודל הבסיס. בתצוגה הישנה זה הגודל של הסקיצה שאושרה, והוא קבוע.
 * בפורמט החדש הוא תקרה: הכרטיס הוא 4:5 ולכן הגובה מוגבל, והרגע נכנס בגודל
 * הגדול ביותר שהוא נכנס בו. הקצה התחתון נשמר גבוה מספיק כדי שרגע ארוך
 * מהרגיל עדיין ייקרא בטלפון.
 */
const BASE_SIZE = 38;
const NEW_MAX_SIZE = 34;
const MIN_SIZE = 26;

/**
 * פריסה אנכית של הרגע כולו. מחזירה את הפריטים ואת הגובה הכולל, כדי שאפשר
 * יהיה למרכז את הגוש ולבדוק אם הוא נכנס.
 */
/**
 * המידות של פריסה אחת. הכרטיס הרגיל (4:5) והכרטיס הגבוה (9:16) חולקים את
 * אותה פריסה אנכית, רק ביחסים ובגבולות אחרים — כך שהקצב של הרגע זהה בשניהם.
 */
type Layout = {
  top: number;
  bottom: number;
  maxSize: number;
  minSize: number;
  titleRatio: number;
  closingRatio: number;
  lineRatio: number;
  stanzaGap: number;
  titleGap: number;
  ornamentGap: number;
  /** הקו הזהוב מתחת לכותרת. בכרטיס הגבוה הוא יורד: שם יש קישוט אחד בלבד בגוף. */
  titleRule: boolean;
};

/** הכרטיס הרגיל — og.png. הערכים כאן הם בדיוק הקבועים הקודמים, כדי שאף
    כרטיס קיים לא ישתנה בבייט אחד. */
const CARD: Layout = {
  top: TEXT_TOP,
  bottom: TEXT_BOTTOM,
  maxSize: NEW_MAX_SIZE,
  minSize: MIN_SIZE,
  titleRatio: TITLE_RATIO,
  closingRatio: CLOSING_RATIO,
  lineRatio: LINE_RATIO,
  stanzaGap: STANZA_GAP_RATIO,
  titleGap: TITLE_GAP_RATIO,
  ornamentGap: ORNAMENT_GAP_RATIO,
  titleRule: true,
};

function compose(format: MomentFormat, size: number, L: Layout = CARD) {
  const items: Placed[] = [];
  const push = (item: Item, h: number) => items.push({ item, h });
  /** רווח בלבד, בלי טקסט */
  const gap = (h: number) => push({ kind: 'line', text: '', size: 0, family: REGULAR, fill: INK, baseline: 0 }, h);

  const flow = !format.isNew;
  const lineHeight = (flow ? FLOW_LINE_RATIO : L.lineRatio) * size;

  if (format.title) {
    const titleSize = size * L.titleRatio;
    const titleHeight = titleSize * 1.34;
    for (const line of wrap(format.title, titleSize, BOLD)) {
      push(
        { kind: 'line', text: line, size: titleSize, family: BOLD, fill: BLUE, baseline: titleHeight * 0.76 },
        titleHeight
      );
    }
    // בלי הקו נשאר המרווח שלו — הכותרת נושמת באותה מידה, רק בלי הקישוט.
    if (L.titleRule) push({ kind: 'title-rule' }, size * TITLE_RULE_GAP * 2);
    else gap(size * TITLE_RULE_GAP * 2);
    gap(size * (L.titleGap - 1));
  }

  format.stanzas.forEach((stanza, index) => {
    // בפורמט החדש השורה נשמרת כפי שנכתבה — היא הפיסוק האמיתי של הרגע.
    // wrap כאן הוא רשת ביטחון לשורה חריגה באורכה בלבד.
    const lines = flow ? wrap(stanza.join(' '), size) : stanza.flatMap((l) => wrap(l, size));
    // ה-baseline של התצוגה הישנה נשמר בדיוק כפי שהיה (size ולא יחס מגובה
    // השורה), כדי שכרטיס שטרם הוגר ייצא זהה לחלוטין לקודמו.
    const baseline = flow ? size : lineHeight * 0.76;
    for (const line of lines) {
      push({ kind: 'line', text: line, size, family: REGULAR, fill: INK, baseline }, lineHeight);
    }
    if (index < format.stanzas.length - 1) {
      gap(size * (flow ? FLOW_GAP_RATIO : L.stanzaGap));
    }
  });

  if (format.closing) {
    push({ kind: 'ornament' }, size * L.ornamentGap * 2);
    const closingSize = size * L.closingRatio;
    const closingHeight = closingSize * 1.4;
    for (const line of format.closing.flatMap((l) => wrap(l, closingSize, BOLD))) {
      push(
        { kind: 'line', text: line, size: closingSize, family: BOLD, fill: BRICK, baseline: closingHeight * 0.76 },
        closingHeight
      );
    }
  }

  const height = items.reduce((sum, i) => sum + i.h, 0);
  return { items, height };
}

/** קטן מהגודל הקבוע רק אם רגע חריג באורכו לא נכנס — רשת ביטחון, לא ברירת מחדל. */
function fit(format: MomentFormat, L: Layout = CARD) {
  const available = L.bottom - L.top;
  const start = format.isNew ? L.maxSize : BASE_SIZE;
  for (let size = start; size >= L.minSize; size -= 1) {
    const candidate = compose(format, size, L);
    if (candidate.height <= available) return candidate;
  }
  return compose(format, L.minSize, L);
}

function ornamentSvg(y: number): string {
  const half = 46;
  const gap = 16;
  const d = 7;
  return [
    `<line x1="${CENTER - half - gap}" y1="${y}" x2="${CENTER - gap}" y2="${y}" stroke="${GOLD}" stroke-width="1.6" opacity="0.75"/>`,
    `<line x1="${CENTER + gap}" y1="${y}" x2="${CENTER + half + gap}" y2="${y}" stroke="${GOLD}" stroke-width="1.6" opacity="0.75"/>`,
    `<rect x="${CENTER - d / 2}" y="${y - d / 2}" width="${d}" height="${d}" fill="${GOLD}" transform="rotate(45 ${CENTER} ${y})"/>`,
  ].join('\n  ');
}

/** LRO (U+202D): כפיית LTR — למספר טלפון בתוך שורה עברית שנכפתה RTL,
    שבלעדיה הספרות היו מתהפכות. PDF סוגר, כמו אצל RLO. */
const LRO = '‭';

/** שורת ההזמנה בתחתית הכרטיס העברי. מספר טלפון בתוכה נעטף LTR מעצמו.
    מילת הקוד "מבט" — בחירת בעל הפרויקט (2026-08-26): נטולת מגדר ("מצטרף"
    נפסל כלשון זכר), מילת המותג עצמה, ומחסום שליחה נמוך. */
const HE_GROUP_LINE = "רוצים עוד רגעים כאלה? שלחו לי 'מבט' — 053-484-9068";

function groupLineSvg(text: string): string {
  const withPhone = escape(text).replace(/\d[\d-]*\d/g, (m) => `${LRO}${m}${PDF}`);
  return `<text x="${CENTER}" y="${HE_GROUP_Y}" font-family="Heebo" font-size="24" fill="${MUTED}" direction="rtl" text-anchor="middle">${RLO}${withPhone}${PDF}</text>`;
}

export function renderMomentCard(
  body: string,
  siteHost: string,
  title?: string | null,
  lang: 'he' | 'es' = 'he',
  groupLine: string = HE_GROUP_LINE
): Buffer {
  const format = parseMoment(body, title);
  const { items, height } = fit(format);
  const rtl = lang !== 'es';
  const direction = rtl ? 'rtl' : 'ltr';
  // אותה שפה עיצובית, חתימה בשפת הקורא. הכתובת בספרדית מצביעה על שער האזור —
  // מי שיקליד את הדומיין לבדו ינחת בעברית.
  const signature = rtl ? `${RLO}נקודת מבט · אפרים עטיה${PDF}` : 'Punto de Vista · Efraim Atia';
  const urlText = rtl ? siteHost : `${siteHost}/es`;

  // מרכוז אנכי של גוש הטקסט בתוך התחום שלו. Math.max שומר על הקצה העליון:
  // רגע ארוך מהרגיל יגלוש למטה ולא ידרוס את נקודת הזהב שבראש הכרטיס.
  let cursor = Math.max(TEXT_TOP, TEXT_TOP + (TEXT_BOTTOM - TEXT_TOP - height) / 2);
  const svg: string[] = [];

  for (const { item, h } of items) {
    if (item.kind === 'line') {
      if (item.text) {
        const y = cursor + item.baseline;
        svg.push(
          `<text x="${CENTER}" y="${y.toFixed(1)}" font-family="${item.family}" font-size="${item.size}" fill="${item.fill}" direction="${direction}" text-anchor="middle">${inline(item.text, rtl)}</text>`
        );
      }
    } else if (item.kind === 'ornament') {
      svg.push(ornamentSvg(Number((cursor + h / 2).toFixed(1))));
    } else if (item.kind === 'title-rule') {
      const y = (cursor + h / 2).toFixed(1);
      svg.push(
        `<line x1="${CENTER - 58}" y1="${y}" x2="${CENTER + 58}" y2="${y}" stroke="${GOLD}" stroke-width="1.6" opacity="0.8"/>`
      );
    }
    cursor += h;
  }

  const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PAPER}"/>
  <circle cx="${CENTER}" cy="${DOT_Y}" r="${DOT_R}" fill="${GOLD}"/>
  ${svg.join('\n  ')}
  <line x1="${CENTER - RULE_HALF}" y1="${RULE_Y}" x2="${CENTER + RULE_HALF}" y2="${RULE_Y}" stroke="${GOLD}" stroke-width="2"/>
  <text x="${CENTER}" y="${rtl ? HE_SIGN_Y : SIGN_Y}" font-family="Heebo Bold" font-size="30" fill="${TEAL_DEEP}" direction="${direction}" text-anchor="middle">${signature}</text>
  ${rtl ? groupLineSvg(groupLine) : ''}
  <text x="${CENTER}" y="${rtl ? HE_URL_Y : URL_Y}" font-family="Heebo" font-size="24" fill="${MUTED}" text-anchor="middle">${escape(urlText)}</text>
</svg>`;

  return new Resvg(doc, {
    fitTo: { mode: 'width', value: WIDTH },
    font: { fontFiles: FONT_FILES, loadSystemFonts: false },
  })
    .render()
    .asPng();
}

// ---------------------------------------------------------------------------
// הכרטיס הגבוה — card.png, 1080x1920 (9:16).
//
// זו התמונה שמשתפים: מהכפתור בעמוד, מדף הבית, ובייצוא היומי לקבוצה.
// og.png (4:5) נשאר לתצוגה המקדימה של קישור, שם תמונה גבוהה נחתכת.
//
// למה גבוה: ב-4:5 גוף הרגע יוצא כ-11px על מסך טלפון. ב-9:16 אותו רגע נכנס
// בכ-41px מתוך 1080 — כ-15px בטלפון, כמו טקסט רגיל בוואטסאפ.
//
// העיצוב (אושר 2026-09-24): דף שמנת אחד, בלי בלוק צבע. צבע רק בשני מקומות —
// הכותרת בכחול והסיום באדום, השיא היחיד. "נקודה לדרך" נפרדת בקו זהב דק
// ובאוויר, בדיו ובמשקל רגיל: קול שני, שקט. הנקודה הזהובה פותחת את הכרטיס
// ומסמנת את "נקודה לדרך" — הקשר לשם המותג. הטלפון מודגש בכחול, בלי זהב.
// ---------------------------------------------------------------------------

export const STORY_HEIGHT = 1920;

const STORY_BASE: Omit<Layout, 'bottom'> = {
  top: 190,
  maxSize: 50,
  minSize: 30,
  titleRatio: 1.42,
  closingRatio: 1.26,
  lineRatio: 1.42,
  stanzaGap: 0.8,
  titleGap: 0.55,
  ornamentGap: 1.1,
  titleRule: false,
};

/** עם "נקודה לדרך" הרגע מסתיים גבוה יותר, כדי לפנות לה את השליש התחתון */
const STORY_WITH_HANDLE: Layout = { ...STORY_BASE, bottom: 1350 };
const STORY_PLAIN: Layout = { ...STORY_BASE, bottom: 1600 };

const HANDLE_SIZE = 50;
const HANDLE_LABEL = 'נקודה לדרך';

/** שורת ה"נקודה לדרך" נשברת היכן שנכתבה (\n). שורה אחת ארוכה נשברת לבד. */
function handleLines(handle: string): string[] {
  const written = handle.split('\n').map((l) => l.trim()).filter(Boolean);
  return written.flatMap((l) => wrap(l, HANDLE_SIZE, REGULAR));
}

export function renderMomentStory(body: string, siteHost: string, title: string, handle?: string | null): Buffer {
  const format = parseMoment(body, title);
  const L = handle ? STORY_WITH_HANDLE : STORY_PLAIN;
  const { items, height } = fit(format, L);
  const t = (x: string) => `${RLO}${escape(x)}${PDF}`;

  let cursor = Math.max(L.top, L.top + (L.bottom - L.top - height) / 2);
  const svg: string[] = [];
  for (const { item, h } of items) {
    if (item.kind === 'line') {
      if (item.text) {
        svg.push(
          `<text x="${CENTER}" y="${(cursor + item.baseline).toFixed(1)}" font-family="${item.family}" font-size="${item.size}" fill="${item.fill}" direction="rtl" text-anchor="middle">${inline(item.text, true)}</text>`
        );
      }
    } else if (item.kind === 'ornament') {
      svg.push(ornamentSvg(Number((cursor + h / 2).toFixed(1))));
    }
    cursor += h;
  }

  const handleSvg: string[] = [];
  if (handle) {
    const lines = handleLines(handle);
    // שתי שורות הן היעד (ראו check:moments). שורה אחת יושבת באמצע אותו תחום.
    const first = lines.length === 1 ? 1632 : 1600;
    handleSvg.push(
      `<line x1="${CENTER - 300}" y1="1412" x2="${CENTER + 300}" y2="1412" stroke="${GOLD}" stroke-width="1.6" opacity="0.55"/>`,
      `<circle cx="${CENTER}" cy="1472" r="8" fill="${GOLD}"/>`,
      `<text x="${CENTER}" y="1526" font-family="Heebo Bold" font-size="29" fill="#8f6f28" direction="rtl" text-anchor="middle" letter-spacing="3">${t(HANDLE_LABEL)}</text>`,
      ...lines.map(
        (line, i) =>
          `<text x="${CENTER}" y="${first + i * 64}" font-family="${REGULAR}" font-size="${HANDLE_SIZE}" fill="${INK}" direction="rtl" text-anchor="middle">${t(line)}</text>`
      )
    );
  }

  const [invite] = HE_GROUP_LINE.split(' — ');
  const phone = HE_GROUP_LINE.match(/\d[\d-]*\d/)?.[0] ?? '';

  const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${STORY_HEIGHT}" viewBox="0 0 ${WIDTH} ${STORY_HEIGHT}">
  <rect width="${WIDTH}" height="${STORY_HEIGHT}" fill="${PAPER}"/>
  <circle cx="${CENTER}" cy="118" r="9" fill="${GOLD}"/>
  ${svg.join('\n  ')}
  ${handleSvg.join('\n  ')}
  <text x="${CENTER}" y="1756" font-family="Heebo" font-size="30" fill="${MUTED}" direction="rtl" text-anchor="middle">${t(invite)}</text>
  <text x="${CENTER}" y="1816" font-family="Heebo Bold" font-size="46" fill="${BLUE}" text-anchor="middle" letter-spacing="3">${LRO}${phone}${PDF}</text>
  <text x="${CENTER}" y="1868" font-family="Heebo" font-size="25" fill="${MUTED}" direction="rtl" text-anchor="middle">${RLO}נקודת מבט · אפרים עטיה · ${PDF}${LRO}${escape(siteHost)}${PDF}</text>
</svg>`;

  return new Resvg(doc, {
    fitTo: { mode: 'width', value: WIDTH },
    font: { fontFiles: FONT_FILES, loadSystemFonts: false },
  })
    .render()
    .asPng();
}
