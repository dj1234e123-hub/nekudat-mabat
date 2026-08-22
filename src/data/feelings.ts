// המצבים והרגשות של "רגע של נקודת מבט".
//
// זו רשימה *פתוחה* ולא סגורה: להוספת מצב חדש מוסיפים כאן שורה אחת, וזהו.
// כל השאר (הוולידציה, עמוד הכניסה, המדפים והכתובות) נגזר אוטומטית מהרשימה הזו.
// slug באנגלית לכתובות נקיות לשיתוף; התווית בעברית לתצוגה.
export const FEELING_GROUPS = [
  {
    slug: 'hurting',
    label: 'כשכואב',
    feelings: [
      { slug: 'pain', label: 'כאב' },
      { slug: 'sadness', label: 'עצב' },
      { slug: 'loneliness', label: 'בדידות' },
      { slug: 'loss', label: 'אובדן' },
      { slug: 'anger', label: 'כעס' },
    ],
  },
  {
    // הקבוצה הזו מחזיקה את משפחת הבושה: רגשות שהכאב בהם מופנה פנימה, אל הזהות
    // עצמה ("אני כזה") ולא אל האירוע. כותרת הקבוצה מנוסחת כקושי ולא כפגם,
    // ובכוונה אין בה שום תווית מאבחנת — מדף שדורש הודאה כתנאי כניסה לא ייפתח.
    slug: 'self',
    label: 'כשקשה מול עצמך',
    feelings: [
      { slug: 'guilt', label: 'אשמה' },
      { slug: 'shame', label: 'בושה' },
      { slug: 'envy', label: 'קנאה' },
      { slug: 'secret', label: 'סוד' },
      { slug: 'losing-control', label: 'חוסר שליטה' },
    ],
  },
  {
    slug: 'stuck',
    label: 'כשקשה להתקדם',
    feelings: [
      { slug: 'fear', label: 'פחד' },
      { slug: 'confusion', label: 'בלבול' },
      { slug: 'pressure', label: 'לחץ' },
      { slug: 'failure', label: 'כישלון' },
      { slug: 'standstill', label: 'תקיעות' },
      { slug: 'exhaustion', label: 'עייפות' },
      { slug: 'waiting', label: 'המתנה' },
    ],
  },
  {
    // שם הקבוצה רחב מ"התחלה חדשה" בכוונה: הוא מחזיק גם תקווה ואמונה, וגם
    // "רגע טוב" — שאיננו התחלה של שום דבר, אלא פשוט משהו שנפתח לרגע.
    slug: 'beginning',
    label: 'כשמשהו נפתח',
    feelings: [
      { slug: 'hope', label: 'תקווה' },
      { slug: 'new-beginning', label: 'התחלה חדשה' },
      { slug: 'faith', label: 'אמונה' },
      { slug: 'confidence', label: 'ביטחון עצמי' },
      { slug: 'good-moment', label: 'רגע טוב' },
    ],
  },
] as const;

export type FeelingSlug = (typeof FEELING_GROUPS)[number]['feelings'][number]['slug'];

/** כל ה-slugים ברצף — משמש לוולידציה של קובצי התוכן */
export const FEELING_SLUGS = FEELING_GROUPS.flatMap((group) =>
  group.feelings.map((feeling) => feeling.slug)
) as FeelingSlug[];

/** התווית העברית של מצב, למשל loneliness → בדידות */
export function feelingLabel(slug: FeelingSlug): string {
  for (const group of FEELING_GROUPS) {
    for (const feeling of group.feelings) {
      if (feeling.slug === slug) return feeling.label;
    }
  }
  return slug;
}

/** התווית של הקבוצה שאליה שייך המצב, למשל loneliness → כשכואב */
export function groupLabel(slug: FeelingSlug): string {
  for (const group of FEELING_GROUPS) {
    if (group.feelings.some((feeling) => feeling.slug === slug)) return group.label;
  }
  return '';
}
