// בית לתוכן של חג – עמוד אחד שאוסף מכל הפינות את מה שנכתב לחג, בסדר השבוע.
//
// למה עמוד ולא עולם תוכן: העולמות מתחלקים לפי מה הסיפור (משל, צדיקים, יומן,
// מהחיים), וסיפורי החג מפוזרים ביניהם. עמוד החג לא מוציא אותם מהבית שלהם –
// הוא רק מסדר אותם לשבוע אחד.
//
// הרשימה ידנית ולא לפי תגית: הסדר והתוויות ("יום א' של חול המועד") הם החלטה,
// ותגית "סוכות" יושבת גם על תוכן שלא שייך לסדרה.
//
// פריט שעוד לא פורסם (תאריך עתידי, או שהקובץ עוד לא בריפו) מוצג כשורה
// "נפתח ב..." – בלי כותרת ובלי תמונה, כדי לא לגלות את הסיפור מראש. השעה
// נלקחת מ-opens, ולכן גם סיפור שעוד לא נכתב מקבל שורה.
//
// opens הוא השעה שמוצגת לקורא (20:30, כשההודעה יוצאת לקבוצה). הסיפור עצמו
// מתפרסם חצי שעה קודם (date = 20:00), כדי שהקישור יהיה חי כשהוא נשלח.
//
// כשיגיע חג שני – להכליל לעמוד /chagim/[slug]/. לא לפני.

export type HolidayItem =
  | { kind: 'mabat'; id: string; label: string; opens: string }
  | { kind: 'besht'; id: string; label: string; opens: string }
  | { kind: 'story'; id: string; label: string; opens: string };

export const SUKKOT = {
  path: '/sukkot/',
  title: 'סוכות',
  kicker: 'חג הסוכות תשפ"ז',
  intro: 'טור לשבת החג, סיפור של הבעל שם טוב למוצאי שבת, וסיפור חדש בכל ערב של חול המועד, בשעה 20:30.',
  // הדלת בדף הבית מופיעה רק בחלון הזה, ונעלמת מעצמה אחריו (גם בלי בנייה
  // חדשה – ראו הסקריפט בדף הבית). מערב החג עד מוצאי אסרו חג.
  homeFrom: '2026-09-25T00:00:00Z',
  homeUntil: '2026-10-04T18:00:00Z',
  items: [
    { kind: 'mabat', id: 'sukkot', label: 'שבת חג הסוכות', opens: '2026-09-25T07:00:00Z' },
    { kind: 'besht', id: 'hakova-shehaya-lesuka', label: 'מוצאי שבת', opens: '2026-09-26T16:30:00Z' },
    { kind: 'story', id: 'haohel-shel-haganan', label: "יום א' של חול המועד", opens: '2026-09-27T17:30:00Z' },
    { kind: 'story', id: 'ayara-shel-zarim', label: "יום ב' של חול המועד", opens: '2026-09-28T17:30:00Z' },
    { kind: 'story', id: 'chelek-baolam-haba', label: "יום ג' של חול המועד", opens: '2026-09-29T17:30:00Z' },
    { kind: 'story', id: 'hatur-hasheni', label: "יום ד' של חול המועד", opens: '2026-10-01T17:30:00Z' },
    { kind: 'story', id: 'hasuka-shezachta', label: "יום ה' של חול המועד", opens: '2026-10-01T17:30:00Z' },
  ] satisfies HolidayItem[],
};

/** "ביום שלישי, 29.9, בשעה 19:30" – תמיד בשעון ישראל, גם כשהבנייה רצה ב-UTC. */
export function opensLabel(iso: string): string {
  const d = new Date(iso);
  const tz = 'Asia/Jerusalem';
  const weekday = new Intl.DateTimeFormat('he-IL', { weekday: 'long', timeZone: tz }).format(d);
  const day = new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'numeric', timeZone: tz }).format(d);
  const time = new Intl.DateTimeFormat('he-IL', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(d);
  return `ב${weekday}, ${day}, בשעה ${time}`;
}

/** האם הדלת לחג מוצגת בדף הבית ברגע הבנייה. */
export function holidayOnHome(h: { homeFrom: string; homeUntil: string }, now = Date.now()): boolean {
  return now >= new Date(h.homeFrom).getTime() && now < new Date(h.homeUntil).getTime();
}
