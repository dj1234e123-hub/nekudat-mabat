// הפורמט של "רגע של נקודת מבט" — קריאת גוף הרגע לארבעת השלבים שלו.
// האפיון המלא: docs/MOMENT-FORMAT.md
//
// למה פענוח משלנו ולא Markdown: השבירה לשורות כאן היא **תוכן ולא עיצוב**.
// "ואתה מתחיל, / לחשוב." ו"ואתה מתחיל לחשוב." הן שתי חוויות שונות, ו-Markdown
// מאחד שורה בודדת לפסקה אחת בדיוק כמו שהוא מאחד רווחים. הפורמט הזה חי על
// העצירות, ולכן הן חייבות לשרוד עד המסך.
//
// אותו פענוח משרת את העמוד ואת תמונת השיתוף, כדי שלא ייווצרו שתי אמיתות
// שמתפצלות עם הזמן.

/** מהלך אחד — המציאות, המסקנה או הסיבוב. השורות כפי שנשברו בקובץ. */
export type Stanza = string[];

export interface MomentFormat {
  /** כותרת-הוו. קיימת רק בפורמט החדש, והיא גם המתג שמפעיל אותו. */
  title: string | null;
  /** המהלכים לפי סדרם. בתצוגה הישנה — פסקה אחת בכל "מהלך", שורה אחת בכל פסקה. */
  stanzas: Stanza[];
  /** משפט הסיום. null בתצוגה הישנה. */
  closing: Stanza | null;
  /** true = הפורמט החדש (כותרת, שורות שבורות, קישוט, סיום מובלט). */
  isNew: boolean;
}

/** השורה שמסמנת את הסיום — והיא גם המקום שבו הקישוט יושב בעמוד. */
const CLOSING_MARK = /^-{3,}$/;

/** חלוקת שורות למהלכים לפי שורות ריקות */
function toStanzas(lines: string[]): Stanza[] {
  const stanzas: Stanza[] = [];
  let current: Stanza = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (line) {
      current.push(line);
    } else if (current.length) {
      stanzas.push(current);
      current = [];
    }
  }
  if (current.length) stanzas.push(current);
  return stanzas;
}

/**
 * גוף הרגע → ארבעת השלבים.
 * @param body גוף הקובץ אחרי ה-frontmatter
 * @param title הכותרת מה-frontmatter. קיימת = פורמט חדש.
 */
export function parseMoment(body: string, title?: string | null): MomentFormat {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const mark = lines.findIndex((line) => CLOSING_MARK.test(line.trim()));

  const hasTitle = Boolean(title && title.trim());
  const isNew = hasTitle || mark !== -1;

  if (mark === -1) {
    const stanzas = toStanzas(lines);
    // פורמט חדש בלי סימן סיום — המהלך האחרון הוא הסיום. רשת ביטחון בלבד:
    // האפיון דורש את הסימן, והוא גם מה שקובע איפה הקישוט יושב.
    if (isNew && stanzas.length > 1) {
      return { title: title?.trim() ?? null, stanzas: stanzas.slice(0, -1), closing: stanzas[stanzas.length - 1], isNew };
    }
    return { title: hasTitle ? title!.trim() : null, stanzas, closing: null, isNew };
  }

  const stanzas = toStanzas(lines.slice(0, mark));
  const closing = toStanzas(lines.slice(mark + 1)).flat();
  return {
    title: hasTitle ? title!.trim() : null,
    stanzas,
    closing: closing.length ? closing : null,
    isNew: true,
  };
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** שורה אחת → HTML. תומך בהדגשה אחת: **מילה** */
export function lineHtml(line: string): string {
  return escapeHtml(line).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

/** אותו טקסט בלי סימני ההדגשה — לשיתוף בוואטסאפ, לתיאורים ולמדידה */
export function plain(line: string): string {
  return line.replace(/\*\*/g, '');
}

/**
 * הרגע כמלל — הטקסט שנשלח בוואטסאפ.
 *
 * **בפורמט החדש השורות נשמרות כפי שנכתבו.** ניסיתי קודם לאחד אותן למשפטים
 * רציפים, וזה שבר את הטקסט: הפסיקים כאן הם פסיקים של דיבור ולא של דקדוק
 * ("יודעים בדיוק, / מה צריך לעשות"), ובשורה אחת הם נקראים כשגיאת פיסוק.
 * וואטסאפ מציג שורות מרובות בלי בעיה, ולכן ההודעה נושאת את הקצב עצמו.
 *
 * בתצוגה הישנה כל מהלך הוא פסקה אחת ממילא, ולכן שם אין הבדל.
 */
export function momentPlainText(format: MomentFormat): string {
  const join = (stanza: Stanza) => plain(format.isNew ? stanza.join('\n') : stanza.join(' '));
  const blocks = format.stanzas.map(join);
  if (format.closing) blocks.push(join(format.closing));
  return blocks.join('\n\n');
}
