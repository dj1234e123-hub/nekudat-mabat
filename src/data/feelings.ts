// המצבים והרגשות של "רגע של נקודת מבט".
//
// זו רשימה *פתוחה* ולא סגורה: להוספת מצב חדש מוסיפים כאן שורה אחת, וזהו.
// כל השאר (הוולידציה, עמוד הכניסה, המדפים והכתובות) נגזר אוטומטית מהרשימה הזו.
// slug באנגלית לכתובות נקיות לשיתוף; התווית בעברית לתצוגה.
//
// line — "שורת הדלת" בעמוד הכניסה: משפט קצר שמזהה ולא מתייג. היא פוגשת את
// הקורא ("זה מוכר לי") בלי להסביר, בלי לייעץ ובלי לחשוף את נקודת המבט של
// הרגעים שבפנים. נבדקת גם כמכלול — שלא תיווצר נוסחה חוזרת בין השורות.
// accent — צבע מותג אחד לכל קבוצה (נקודות וקווים בלבד, לא מילוי), באותו
// דפוס של עולמות הסיפורים.
export const FEELING_GROUPS = [
  {
    slug: 'hurting',
    label: 'כשכואב',
    accent: 'var(--brick)',
    feelings: [
      { slug: 'pain', label: 'כאב', line: 'הזמן עבר, והוא עדיין כאן.' },
      { slug: 'sadness', label: 'עצב', line: 'דברים קטנים נהיו כבדים.' },
      { slug: 'loneliness', label: 'בדידות', line: 'גם כשיש אנשים מסביב.' },
      { slug: 'loss', label: 'אובדן', line: 'משהו חסר, כל הזמן.' },
      { slug: 'anger', label: 'כעס', line: 'רותח בפנים, שקט בחוץ.' },
    ],
  },
  {
    // הקבוצה הזו מחזיקה את משפחת הבושה: רגשות שהכאב בהם מופנה פנימה, אל הזהות
    // עצמה ("אני כזה") ולא אל האירוע. כותרת הקבוצה מנוסחת כקושי ולא כפגם,
    // ובכוונה אין בה שום תווית מאבחנת — מדף שדורש הודאה כתנאי כניסה לא ייפתח.
    slug: 'self',
    label: 'כשקשה מול עצמך',
    accent: 'var(--blue)',
    feelings: [
      { slug: 'guilt', label: 'אשמה', line: 'על מה שעשית, ועל מה שלא.' },
      { slug: 'shame', label: 'בושה', line: 'עולה פתאום, גם אחרי שנים.' },
      { slug: 'envy', label: 'קנאה', line: 'שמחים בשבילם. כמעט.' },
      { slug: 'secret', label: 'סוד', line: 'הולך איתך לכל מקום.' },
      { slug: 'losing-control', label: 'חוסר שליטה', line: 'לראות את זה קורה, שוב.' },
    ],
  },
  {
    slug: 'stuck',
    label: 'כשקשה להתקדם',
    accent: 'var(--teal)',
    feelings: [
      { slug: 'fear', label: 'פחד', line: 'עומדים ליד הדלת, ולא פותחים.' },
      { slug: 'confusion', label: 'בלבול', line: 'כל הדרכים נראות אותו דבר.' },
      { slug: 'pressure', label: 'לחץ', line: 'היום נגמר לפני שהתחיל.' },
      { slug: 'failure', label: 'כישלון', line: 'הרגע ההוא, בהילוך חוזר.' },
      { slug: 'standstill', label: 'תקיעות', line: 'עוד שבוע. שום דבר לא זז.' },
      { slug: 'exhaustion', label: 'עייפות', line: 'לקום בבוקר, וכבר לחכות לערב.' },
      { slug: 'waiting', label: 'המתנה', line: 'לבדוק את הטלפון, עוד פעם.' },
    ],
  },
  {
    // שם הקבוצה רחב מ"התחלה חדשה" בכוונה: הוא מחזיק גם תקווה ואמונה, וגם
    // "רגע טוב" — שאיננו התחלה של שום דבר, אלא פשוט משהו שנפתח לרגע.
    slug: 'beginning',
    label: 'כשמשהו נפתח',
    accent: 'var(--gold)',
    feelings: [
      { slug: 'hope', label: 'תקווה', line: 'עוד לא קרה כלום, ובכל זאת.' },
      { slug: 'new-beginning', label: 'התחלה חדשה', line: 'דף חדש. היד קצת רועדת.' },
      { slug: 'faith', label: 'אמונה', line: 'פעם זה הרגיש פשוט יותר.' },
      { slug: 'confidence', label: 'ביטחון עצמי', line: 'לדעת את התשובה, ולשתוק.' },
      { slug: 'good-moment', label: 'רגע טוב', line: 'אולי היה אחד כזה היום.' },
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
