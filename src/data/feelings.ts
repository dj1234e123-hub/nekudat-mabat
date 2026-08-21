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
    ],
  },
  {
    slug: 'beginning',
    label: 'כשמתחילים מחדש',
    feelings: [
      { slug: 'hope', label: 'תקווה' },
      { slug: 'new-beginning', label: 'התחלה חדשה' },
      { slug: 'faith', label: 'אמונה' },
      { slug: 'confidence', label: 'ביטחון עצמי' },
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
