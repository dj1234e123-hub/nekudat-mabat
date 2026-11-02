// נושאי הסיפורים (2026-11-02). ציר שלישי לצד העולמות (מה הסיפור הוא) והרגעים (מה עובר עליך):
// על מה הסיפור מדבר. האוספים נבחרים ביד ומשתנים מדי פעם, לפי שיקול דעתו של בעל הפרויקט.
//
// איך מוסיפים או משנים נושא:
//   1. שורה אחת במערך THEMES: slug באנגלית (לכתובות), label בעברית, ו-tags – התגיות
//      מקובצי הסיפורים (שדה tags) ששייכות לנושא. סיפור שיש לו אחת מהתגיות נכנס לנושא.
//   2. מריצים `npm run check:themes` – הבדיקה מציגה כמה סיפורים בכל נושא ואילו סיפורים
//      לא משויכים לאף נושא. סיפור בלי נושא = להוסיף לו תגית קיימת או להרחיב נושא.
// סיפור יכול להשתייך לכמה נושאים. "אמונה" אינה נושא: היא מופיעה ב-12 סיפורים והיא הרקע
// של האתר כולו (נשמר מההחלטה על תגיות, 2026-08-23).
// קובץ .mjs כדי שגם הסקריפט שבודק וגם האתר יקראו אותו.

/** @type {{ slug: string, label: string, labelEs: string, tags: string[] }[]} */
export const THEMES = [
  { slug: 'hope', label: 'תקווה', labelEs: 'Esperanza', tags: ['תקווה'] },
  { slug: 'forgiveness', label: 'סליחה ותשובה', labelEs: 'Perdón y arrepentimiento', tags: ['סליחה', 'תשובה'] },
  { slug: 'kindness', label: 'חסד', labelEs: 'Bondad', tags: ['חסד', 'נתינה', 'מתנה'] },
  { slug: 'children', label: 'חינוך וילדים', labelEs: 'Educación e infancia', tags: ['חינוך', 'ילדים'] },
  { slug: 'courage', label: 'אומץ', labelEs: 'Valentía', tags: ['אומץ'] },
  { slug: 'prayer', label: 'תפילה', labelEs: 'Oración', tags: ['תפילה'] },
  { slug: 'family', label: 'משפחה', labelEs: 'Familia', tags: ['משפחה'] },
  { slug: 'memory', label: 'שואה וזיכרון', labelEs: 'Shoá y memoria', tags: ['שואה'] },
  { slug: 'habits', label: 'הרגלים ובחירות', labelEs: 'Hábitos y decisiones', tags: ['הרגלים', 'הרגל', 'שגרה', 'בחירה', 'מעשה קטן', 'כעס', 'מחשבה'] },
];

// סיפורי חג: אינם צריכים נושא. הם חיים בעמודי החג (/sukkot/ ובעתיד חגים נוספים), והנושאים הם
// על מה הסיפור מדבר ולא על מתי הוא נכתב. הבדיקה לא נכשלת על סיפור שיש לו אחת מהתגיות האלה.
export const HOLIDAY_TAGS = ['סוכות', 'שמחת תורה', 'אחרי החגים'];

/** הנושאים של סיפור לפי התגיות שלו. */
export function themesOf(tags = []) {
  return THEMES.filter((t) => t.tags.some((x) => tags.includes(x)));
}
