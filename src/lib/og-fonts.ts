// הבסיס המשותף לתמונות שנוצרות בזמן הבנייה (resvg): הפונטים, מדידת רוחב,
// והתווים הבלתי-נראים ששולטים בכיווניות.
//
// הוצא מ-moment-card.ts כשנוספה תמונת הציטוט של "מבט לשבת" (quote-card.ts),
// כדי שהידע הקשה ביותר בקוד הזה — ה-bidi ומדידת הרוחב — ייכתב פעם אחת.
// ההוצאה היא העברה בלבד: אומת שכל 150 כרטיסי הרגעים יוצאים זהים בייט-בייט.
//
// הפונטים כאן אינם קובצי האתר: תת-הקבוצה העברית ב-public/fonts אינה מכילה
// סימני פיסוק כלל, ולכן נבנו קבצים ייעודיים שממזגים עברית + לטינית, בגרסה
// סטטית (הגרסה המשתנה מכשילה את מנתחי הפונטים).
import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';

export const REGULAR = 'Frank Ruhl Libre';
export const BOLD = 'Frank Ruhl Libre Bold';

// מבוסס על תיקיית הפרויקט ולא על import.meta.url: הקוד הזה רץ אחרי האריזה,
// מתוך dist/, ושם הנתיב היחסי כבר לא מצביע על קובצי המקור.
const fontPath = (name: string) => path.resolve(process.cwd(), 'src/assets/og-fonts', `${name}.ttf`);
export const FONT_FILES = ['frank', 'frank-bold', 'heebo', 'heebo-bold'].map(fontPath);

/** נטען פעם אחת לכל הבנייה — כל התמונות מאותם קבצים. */
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
export function measure(text: string, size: number, family = REGULAR): number {
  const font = FONTS[family];
  const scale = size / font.unitsPerEm;
  let width = 0;
  for (const char of text) {
    width += (font.charToGlyph(char).advanceWidth ?? 0) * scale;
  }
  return width;
}

export const escape = (s: string) =>
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
export const RLO = '‮';
export const PDF = '‬';

/** LRO (U+202D): כפיית LTR — למספר טלפון או כתובת בתוך שורה עברית שנכפתה RTL,
    שבלעדיה הספרות היו מתהפכות. PDF סוגר, כמו אצל RLO. */
export const LRO = '‭';
