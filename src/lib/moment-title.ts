// כותרת של "רגע" — נגזרת מהטקסט עצמו.
//
// למה בכלל: 66 עמודי הרגעים נשאו 22 כותרות בלבד — שלושת הרגעים של "אשמה"
// כולם נקראו "אשמה · רגע של נקודת מבט". הכותרת היא מה שגוגל מציג בתוצאה
// ומה שקובע אם לוחצים, ושלושה עמודים עם כותרת זהה נראים לו כשכפול.
//
// למה גזירה ולא שדה בכל קובץ: הטקסטים האלה משתנים. 66 התכנים נוסחו מחדש
// להתאמה לשני המינים באותו יום — וכל כותרת שנכתבה ידנית הייתה מתיישנת
// באותו רגע, בשקט. כותרת שנגזרת מהטקסט מתעדכנת איתו.
//
// שם המצב אינו נכנס לכותרת: הכותרת נשמרת בהיסטוריית הדפדפן ובקישור
// משותף, ו"בושה" שם מתייג את מי שקרא — אותו היגיון שהוציא את שם המצב
// מתמונת השיתוף.

/** מתחת לזה הכותרת קצרה מדי כדי להבדיל בין עמודים — נצרף את המשפט הבא. */
const MIN = 20;
/** מעל זה גוגל חותך ממילא. */
const MAX = 65;

const SENTENCE_END = /[.?!…]/;
/** סימני סגירה שנצמדים לסוף משפט ושייכים לו */
const CLOSERS = '"”\'’)]';
/** נקודות חיתוך טבעיות בתוך משפט ארוך, לפי סדר עדיפות במשפט */
const CLAUSE_BREAKS = [':', '—', '–', ';', ','];

/**
 * סוף המשפט הראשון, כולל סימני הסגירה שאחריו.
 * נקודה בתוך מירכאות פתוחות אינה מסיימת משפט — אלא אם המירכאות נסגרות
 * מיד אחריה, שזה הכתיב הרגיל של ציטוט: "היה צריך להתקשר."
 */
function firstSentenceEnd(text: string, from = 0): number {
  let open = false;
  for (let i = from; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"' || ch === '”' || ch === '“') open = !open;
    if (!SENTENCE_END.test(ch)) continue;
    const closes = i + 1 < text.length && CLOSERS.includes(text[i + 1]);
    if (open && !closes) continue;
    let end = i + 1;
    while (end < text.length && CLOSERS.includes(text[end])) end++;
    return end;
  }
  return text.length;
}

/** קיצור משפט ארוך — בעדיפות בנקודת חיתוך טבעית, ורק אחרת באמצע. */
function shorten(sentence: string): string {
  if (sentence.length <= MAX) return sentence;

  const window = sentence.slice(0, MAX);
  let best = -1;
  for (const mark of CLAUSE_BREAKS) {
    const at = window.lastIndexOf(mark);
    if (at > best) best = at;
  }
  if (best >= MIN) return sentence.slice(0, best);

  const cut = window.lastIndexOf(' ');
  return `${sentence.slice(0, cut > MIN ? cut : MAX).trimEnd()}…`;
}

/**
 * כותרת העמוד של רגע, מגוף הטקסט שלו.
 * המשפט הראשון; אם הוא קצר מדי — גם הבא אחריו, עד שיש במה להבדיל.
 */
export function momentTitle(body: string): string {
  const paragraph = body
    .trim()
    .split(/\n\s*\n/)[0]
    .replace(/\*+/g, '') // הדגשות markdown
    .replace(/\s+/g, ' ')
    .trim();

  let end = firstSentenceEnd(paragraph);
  while (end < paragraph.length && end < MIN) {
    end = firstSentenceEnd(paragraph, end);
  }

  let title = shorten(paragraph.slice(0, end).trim());

  // כותרת אינה נחתמת בנקודה או בפסיק; סימן שאלה וקריאה כן נשארים.
  title = title.replace(/[.,:;—–\s]+$/, '');

  // מירכאות שעוטפות את הכותרת כולה יורדות — בתוך המשפט הן נשארות.
  if (/^["“](.*)["”]$/.test(title) && !/["“”]/.test(title.slice(1, -1))) {
    title = title.slice(1, -1).trim();
  }

  return title;
}
